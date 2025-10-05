# Настройка Google Cloud Vision API

## 🎯 Что это дает

Google Cloud Vision API - это мощный инструмент для распознавания текста (OCR) с документов. Он точнее распознает:
- Российские паспорта
- Международные паспорта
- Патенты на работу
- Водительские удостоверения

## 📋 Шаг 1: Создание проекта в Google Cloud

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Запомните **Project ID**

## 🔑 Шаг 2: Включение Vision API

1. Перейдите в **APIs & Services** → **Library**
2. Найдите **Cloud Vision API**
3. Нажмите **Enable**

## 🔐 Шаг 3: Создание Service Account

1. Перейдите в **IAM & Admin** → **Service Accounts**
2. Нажмите **Create Service Account**
3. Заполните:
   - **Name**: `steelbike-vision-ocr`
   - **Description**: `OCR for document recognition`
4. Нажмите **Create and Continue**
5. Выберите роль: **Cloud Vision AI Service Agent**
6. Нажмите **Continue** → **Done**

## 📥 Шаг 4: Создание ключа

1. Найдите созданный Service Account в списке
2. Нажмите на него
3. Перейдите на вкладку **Keys**
4. Нажмите **Add Key** → **Create new key**
5. Выберите тип **JSON**
6. Нажмите **Create**
7. Файл `steelbike-vision-ocr-xxxxx.json` скачается автоматически

## 🚀 Шаг 5: Настройка в Vercel

### Вариант A: Через переменную окружения (рекомендуется)

1. Откройте скачанный JSON файл
2. Скопируйте **всё содержимое** файла
3. Откройте [Vercel Dashboard](https://vercel.com)
4. Перейдите в Settings → Environment Variables
5. Добавьте переменную:
   - **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value**: вставьте содержимое JSON файла
   - **Environment**: Production, Preview, Development

6. Обновите `api/auth.js`:

```javascript
// В начале файла добавьте:
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = '/tmp/google-credentials.json';
    require('fs').writeFileSync('/tmp/google-credentials.json', JSON.stringify(credentials));
}
```

### Вариант B: Через файл (для локальной разработки)

1. Переименуйте скачанный файл в `google-credentials.json`
2. Положите его в корень проекта
3. Добавьте в `.gitignore`:
```
google-credentials.json
```

4. Для Vercel загрузите файл через Dashboard:
   - Settings → Environment Variables
   - Add → File
   - Upload `google-credentials.json`

## 🧪 Шаг 6: Тестирование

### Локально:

```bash
# Установите зависимости
npm install

# Установите переменную окружения
export GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"

# Запустите тест
node test-vision.js
```

### Создайте `test-vision.js`:

```javascript
const vision = require('@google-cloud/vision');

async function testVision() {
    const client = new vision.ImageAnnotatorClient();
    
    // Тест с URL картинки
    const [result] = await client.textDetection(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Russian_international_passport.jpg/800px-Russian_international_passport.jpg'
    );
    
    const detections = result.textAnnotations;
    console.log('Распознанный текст:');
    console.log(detections[0].description);
}

testVision().catch(console.error);
```

## 📊 Проверка в production

После деплоя на Vercel:

1. Откройте Vercel Dashboard → Deployments → Latest
2. Перейдите в Functions → Logs
3. Найдите логи с `Vision OCR result`
4. Проверьте, что текст распознается

## 💰 Стоимость

Google Cloud Vision API:
- **Первые 1000 запросов/месяц**: БЕСПЛАТНО
- **Далее**: $1.50 за 1000 запросов

Для проекта с ~100 регистраций/месяц = **БЕСПЛАТНО**

## 🔧 Troubleshooting

### Ошибка: "Could not load the default credentials"

**Решение**: Проверьте, что переменная `GOOGLE_APPLICATION_CREDENTIALS` установлена правильно.

```bash
# Проверка локально
echo $GOOGLE_APPLICATION_CREDENTIALS

# Проверка в Vercel
# Settings → Environment Variables → найдите GOOGLE_APPLICATION_CREDENTIALS_JSON
```

### Ошибка: "Permission denied"

**Решение**: Убедитесь, что Service Account имеет роль **Cloud Vision AI Service Agent**.

### Ошибка: "API not enabled"

**Решение**: Включите Cloud Vision API в Google Cloud Console.

## 📝 Пример распознанных данных

```json
{
  "full_name": "Иванов Иван Иванович",
  "birth_date": "15.05.1990",
  "passport_number": "4509 123456",
  "issue_date": "20.06.2010",
  "issuer": "ОВД Центрального района г. Москвы",
  "registration_address": "г. Москва, ул. Ленина, д. 1, кв. 1",
  "raw_text": "ПАСПОРТ ГРАЖДАНИНА РОССИЙСКОЙ ФЕДЕРАЦИИ..."
}
```

## ✅ Готово!

Теперь ваше приложение использует Google Cloud Vision для точного распознавания документов! 🎉

---

**Полезные ссылки:**
- [Google Cloud Vision Docs](https://cloud.google.com/vision/docs)
- [Node.js Client Library](https://github.com/googleapis/nodejs-vision)
- [Pricing](https://cloud.google.com/vision/pricing)
