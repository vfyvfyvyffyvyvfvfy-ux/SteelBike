const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
// +++ Google Cloud Vision API +++
const vision = require('@google-cloud/vision');

// Настройка Google Cloud credentials для Vercel
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        const credPath = '/tmp/google-credentials.json';
        fs.writeFileSync(credPath, JSON.stringify(credentials));
        process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
        console.log('✅ Google Cloud credentials loaded from environment variable');
    } catch (err) {
        console.error('❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', err);
    }
}

function createSupabaseAdmin() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase service credentials are not configured.');
    }
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function validateTelegramData(initData, botToken) {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');

        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();

        const hmac = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        return hmac === hash;
    } catch (error) {
        console.error('Telegram data validation error:', error);
        return false;
    }
}

async function triggerOCRProcessing(userId, fileIds) {
    try {
        const ocrWorkerUrl = process.env.OCR_WORKER_URL;
        const internalSecret = process.env.INTERNAL_SECRET;

        if (!ocrWorkerUrl || !internalSecret) {
            console.warn('OCR Worker not configured, skipping OCR processing');
            return;
        }

        axios.post(`${ocrWorkerUrl}/process-document`, {
            userId,
            fileIds
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Secret': internalSecret
            },
            timeout: 5000
        }).catch(error => {
            console.error('Failed to trigger OCR processing:', error.message);
        });

        console.log(`OCR processing triggered for user ${userId}`);
    } catch (error) {
        console.error('Error triggering OCR processing:', error);
    }
}

// +++ НОВАЯ ФУНКЦИЯ ДЛЯ РАСПОЗНАВАНИЯ С GOOGLE CLOUD VISION +++
async function recognizeDocumentsWithVision(supabaseAdmin, filePaths, countryCode) {
    // Инициализируем Vision API клиент
    const client = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json'
    });

    const allText = [];
    const recognizedData = {
        full_name: null,
        birth_date: null,
        passport_number: null,
        issue_date: null,
        issuer: null,
        registration_address: null,
        raw_text: ''
    };

    // Скачиваем и распознаем каждый файл
    for (const path of filePaths) {
        try {
            const { data, error } = await supabaseAdmin.storage.from('passports').download(path);
            if (error) {
                console.error(`Failed to download ${path} from Supabase:`, error);
                continue;
            }

            // Конвертируем в Buffer для Vision API
            const buffer = Buffer.from(await data.arrayBuffer());

            // Вызываем Vision API для распознавания текста
            const [result] = await client.textDetection(buffer);
            const detections = result.textAnnotations;

            if (detections && detections.length > 0) {
                // Первый элемент содержит весь текст
                const fullText = detections[0].description;
                allText.push(fullText);
                console.log(`OCR result for ${path}:`, fullText.substring(0, 200));
            }
        } catch (err) {
            console.error(`Error processing ${path}:`, err);
        }
    }

    if (allText.length === 0) {
        console.log("No text recognized from images.");
        return recognizedData;
    }

    // Объединяем весь текст
    const combinedText = allText.join('\n\n');
    recognizedData.raw_text = combinedText;

    // Парсим данные в зависимости от страны
    if (countryCode === 'ru') {
        // Российский паспорт
        recognizedData.full_name = extractRussianName(combinedText);
        recognizedData.birth_date = extractBirthDate(combinedText);
        recognizedData.passport_number = extractPassportNumber(combinedText);
        recognizedData.issue_date = extractIssueDate(combinedText);
        recognizedData.issuer = extractIssuer(combinedText);
        recognizedData.registration_address = extractAddress(combinedText);
    } else {
        // Для других стран - базовое извлечение
        recognizedData.full_name = extractInternationalName(combinedText);
        recognizedData.birth_date = extractBirthDate(combinedText);
        recognizedData.passport_number = extractInternationalPassport(combinedText);
    }

    return recognizedData;
}

// Вспомогательные функции для парсинга
function extractRussianName(text) {
    // Ищем ФИО после слова "Фамилия" или в начале документа
    const nameMatch = text.match(/(?:Фамилия|Surname)[:\s]*([А-ЯЁ]+)[:\s]*([А-ЯЁ]+)[:\s]*([А-ЯЁ]+)/i);
    if (nameMatch) {
        return `${nameMatch[1]} ${nameMatch[2]} ${nameMatch[3]}`;
    }
    // Альтернативный поиск
    const altMatch = text.match(/([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)/);
    return altMatch ? `${altMatch[1]} ${altMatch[2]} ${altMatch[3]}` : null;
}

function extractInternationalName(text) {
    // Ищем имя в латинице
    const nameMatch = text.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/);
    return nameMatch ? nameMatch[0] : null;
}

function extractBirthDate(text) {
    // Ищем дату рождения в формате ДД.ММ.ГГГГ или DD.MM.YYYY
    const dateMatch = text.match(/(?:Дата рождения|Date of birth|Birth)[:\s]*(\d{2}[.\-\/]\d{2}[.\-\/]\d{4})/i);
    if (dateMatch) return dateMatch[1];
    
    // Альтернативный поиск любой даты
    const altMatch = text.match(/(\d{2}[.\-\/]\d{2}[.\-\/]\d{4})/);
    return altMatch ? altMatch[1] : null;
}

function extractPassportNumber(text) {
    // Российский паспорт: серия (4 цифры) номер (6 цифр)
    const passportMatch = text.match(/(\d{4})\s*(\d{6})/);
    return passportMatch ? `${passportMatch[1]} ${passportMatch[2]}` : null;
}

function extractInternationalPassport(text) {
    // Международный паспорт: обычно буквы + цифры
    const passportMatch = text.match(/([A-Z]{1,2}\d{7,9})/);
    return passportMatch ? passportMatch[1] : null;
}

function extractIssueDate(text) {
    // Дата выдачи
    const dateMatch = text.match(/(?:Дата выдачи|Issue date)[:\s]*(\d{2}[.\-\/]\d{2}[.\-\/]\d{4})/i);
    return dateMatch ? dateMatch[1] : null;
}

function extractIssuer(text) {
    // Кем выдан
    const issuerMatch = text.match(/(?:Кем выдан|Issued by)[:\s]*([^\n]{10,100})/i);
    return issuerMatch ? issuerMatch[1].trim() : null;
}

function extractAddress(text) {
    // Адрес регистрации
    const addressMatch = text.match(/(?:Место жительства|Address|Адрес)[:\s]*([^\n]{10,200})/i);
    return addressMatch ? addressMatch[1].trim() : null;
}

async function handler(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST, OPTIONS');
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new Error('TELEGRAM_BOT_TOKEN is not configured');
        }

        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { action } = body;

        if (action === 'login') {
            const { initData } = body;
            if (!validateTelegramData(initData, botToken)) {
                return res.status(401).json({ error: 'Invalid Telegram data' });
            }
            const urlParams = new URLSearchParams(initData);
            const userData = JSON.parse(decodeURIComponent(urlParams.get('user')));
            const telegramUserId = userData.id;
            const supabaseAdmin = createSupabaseAdmin();
            const { data: client, error } = await supabaseAdmin
                .from('clients')
                .select('*')
                .eq('extra->telegram_user_id', telegramUserId)
                .single();
            if (error || !client) {
                return res.status(404).json({ error: 'User not found. Please register first.' });
            }
            return res.status(200).json({
                success: true,
                user: {
                    id: client.id,
                    name: client.name,
                    phone: client.phone,
                    city: client.city,
                    balance_rub: client.balance_rub,
                    verification_status: client.extra?.verification_status
                }
            });
        } else if (action === 'bot-register') {
            const { userId: telegram_user_id, formData } = req.body;
            // Убираем recognized_data, так как мы его получим сами
            const { name, phone, video_note_storage_path, ...otherData } = formData;

            if (!name || !phone || !video_note_storage_path || !telegram_user_id) {
                return res.status(400).json({ error: 'Missing required registration data from bot.' });
            }

            const supabaseAdmin = createSupabaseAdmin();

            // +++ ЛОГИКА РАСПОЗНАВАНИЯ +++
            // 1. Собираем пути к файлам-картинкам
            const imagePathsToRecognize = Object.keys(otherData)
                .filter(key => key.endsWith('_storage_path') && key !== 'video_note_storage_path')
                .map(key => otherData[key]);

            // 2. Вызываем Google Cloud Vision OCR
            let recognized_data = {};
            if (imagePathsToRecognize.length > 0) {
                try {
                    console.log(`Starting Vision OCR for user ${telegram_user_id} with files:`, imagePathsToRecognize);
                    recognized_data = await recognizeDocumentsWithVision(
                        supabaseAdmin,
                        imagePathsToRecognize,
                        otherData.citizenship || 'ru'
                    );
                    console.log(`Vision OCR result for user ${telegram_user_id}:`, recognized_data);
                } catch (e) {
                    console.error("Vision OCR failed:", e);
                    // Можно не прерывать регистрацию, а просто записать ошибку
                    recognized_data = { error: `Recognition failed: ${e.message}` };
                }
            }
            // +++ КОНЕЦ ЛОГИКИ РАСПОЗНАВАНИЯ +++

            const extra = {
                ...otherData,
                telegram_user_id: telegram_user_id,
                // Переименовываем для консистентности
                video_selfie_storage_path: video_note_storage_path,
            };

            const { data: clientData, error: clientError } = await supabaseAdmin
                .from("clients")
                .insert([{
                    name,
                    phone,
                    city: otherData.city,
                    extra,
                    verification_status: 'needs_confirmation',
                    // Сохраняем распознанные данные
                    recognized_passport_data: recognized_data,
                    telegram_user_id: telegram_user_id // <--- FIX: Save to main column too
                }])
                .select()
                .single();

            if (clientError) {
                if (clientError.message.includes('duplicate key')) {
                    return res.status(409).json({ error: "Пользователь с таким номером или Telegram ID уже существует." });
                }
                throw clientError;
            }

            return res.status(200).json({
                success: true,
                client: clientData,
                message: 'Ваши данные приняты на проверку.'
            });
        } else { // Default to webapp-register
            const { initData, formData } = body;
            if (!validateTelegramData(initData, botToken)) {
                return res.status(401).json({ error: 'Invalid Telegram data' });
            }
            const urlParams = new URLSearchParams(initData);
            const userData = JSON.parse(decodeURIComponent(urlParams.get('user')));
            const userId = userData.id;
            const supabaseAdmin = createSupabaseAdmin();
            const {
                name, phone, city, citizenship, emergency_contact_phone,
                recognized_data, inn, has_no_registration_stamp, migrant_info,
                file_ids = []
            } = formData || {};
            let normalizedFileIds = [];
            if (Array.isArray(file_ids)) {
                normalizedFileIds = file_ids.filter((item) => item && item.file_id && item.field);
            } else if (typeof file_ids === 'string' && file_ids.trim()) {
                try {
                    const parsed = JSON.parse(file_ids);
                    if (Array.isArray(parsed)) {
                        normalizedFileIds = parsed.filter((item) => item && item.file_id && item.field);
                    }
                } catch (err) {
                    console.warn('Failed to parse file_ids string:', err);
                }
            }
            if (!name || !phone || !city) {
                return res.status(400).json({ error: 'Name, phone, and city are required.' });
            }
            const migrantInfo = (() => {
                if (!migrant_info) return {};
                if (typeof migrant_info === 'string') {
                    try {
                        return JSON.parse(migrant_info) || {};
                    } catch {
                        return {};
                    }
                }
                if (typeof migrant_info === 'object') {
                    return migrant_info;
                }
                return {};
            })();
            const extra = {
                citizenship: citizenship || '',
                emergency_contact_phone: emergency_contact_phone || '',
                migrant_info: migrantInfo,
                telegram_user_id: userId,
                verification_status: normalizedFileIds.length > 0 ? 'pending_ocr' : 'approved'
            };
            if (citizenship === 'ru') {
                extra.inn = inn || '';
                extra.has_no_registration_stamp = has_no_registration_stamp === 'true';
            } else {
                extra.inn = inn || '';
            }
            const { data: clientData, error: clientError } = await supabaseAdmin
                .from("clients")
                .insert([{ name, phone, city, extra }])
                .select()
                .single();
            if (clientError) {
                if (clientError.message.includes('duplicate key value violates unique constraint "clients_phone_key"')) {
                    return res.status(409).json({ error: "Пользователь с таким номером телефона уже зарегистрирован." });
                }
                throw clientError;
            }
            const newUserId = clientData.id;
            if (normalizedFileIds.length > 0) {
                triggerOCRProcessing(newUserId, normalizedFileIds);
            }
            return res.status(200).json({
                success: true,
                client: clientData,
                message: normalizedFileIds.length > 0
                    ? 'Регистрация принята. Документы обрабатываются.'
                    : 'Регистрация завершена успешно.'
            });
        }
    } catch (error) {
        console.error('Authentication handler error:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = handler;
