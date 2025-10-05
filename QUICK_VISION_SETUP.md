# 🚀 Быстрая настройка Google Cloud Vision

## 1️⃣ Получите JSON ключ

1. Откройте https://console.cloud.google.com/
2. Создайте проект (или выберите существующий)
3. Включите **Cloud Vision API**
4. Создайте **Service Account** с ролью **Cloud Vision AI Service Agent**
5. Создайте **JSON ключ** и скачайте файл

## 2️⃣ Добавьте в Vercel

1. Откройте скачанный JSON файл
2. Скопируйте **ВСЁ содержимое**
3. Откройте Vercel → Settings → Environment Variables
4. Добавьте:
   - Name: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: вставьте JSON
   - Environment: Production, Preview, Development

## 3️⃣ Деплой

```bash
npm install
vercel --prod
```

## ✅ Готово!

Теперь OCR работает через Google Cloud Vision! 🎉

## 🧪 Тест

Зарегистрируйте пользователя через бота и проверьте логи в Vercel:

```
✅ Google Cloud credentials loaded
Starting Vision OCR for user 123456
Vision OCR result: { full_name: "Иванов Иван", ... }
```
