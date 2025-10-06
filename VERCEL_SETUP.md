# Настройка переменных окружения в Vercel

## Быстрая настройка

### Через Vercel Dashboard

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

### Обязательные переменные

```bash
# Supabase
SUPABASE_URL=https://qjrycnazrzetnciyqakm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnljbmF6cnpldG5jaXlxYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODcyMTYsImV4cCI6MjA3NTI2MzIxNn0.5SLKsfOjnSk-rehECpH1FPgCflCl1mi511VBTsDUXdU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnljbmF6cnpldG5jaXlxYWttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY4NzIxNiwiZXhwIjoyMDc1MjYzMjE2fQ.2d9EIff6My4Muv5qzjtbeV3RXpwAlHTNh3icxF-cIU8

# Google AI
GOOGLE_API_KEY=AIzaSyCds0FmujbSW88GPJwXeyhIjD8JOdyx5uU
GEMINI_API_KEY=AIzaSyCds0FmujbSW88GPJwXeyhIjD8JOdyx5uU

# Telegram
TELEGRAM_BOT_TOKEN=8161502944:AAG7jnhO963k4w0RXAy808qL9IMVn3sASGQ

# YooKassa
YOOKASSA_SHOP_ID=1165363
YOOKASSA_SECRET_KEY=live_HOBpl4TqCwl-BBo2JP7hDCUpCIKJbY4pddBAHO4R-eU

# Service URLs
BOT_NOTIFY_URL=https://steelbikedogovor.onrender.com/notify
OCR_WORKER_URL=https://832a1274ed7e.ngrok-free.app
CONTRACTS_API_URL=https://steelbikedogovor.onrender.com

# Security
ADMIN_SECRET_KEY=your_super_secret_admin_key
INTERNAL_SECRET=MySuperSecretKeyForBikeAppOCR123!
```

### Через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Добавьте переменные
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add GOOGLE_API_KEY production
vercel env add GEMINI_API_KEY production
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add YOOKASSA_SHOP_ID production
vercel env add YOOKASSA_SECRET_KEY production
vercel env add BOT_NOTIFY_URL production
vercel env add OCR_WORKER_URL production
vercel env add CONTRACTS_API_URL production
vercel env add ADMIN_SECRET_KEY production
vercel env add INTERNAL_SECRET production
```

## Проверка настройки

После добавления переменных:

1. Сделайте новый деплой: `vercel --prod`
2. Откройте приложение в браузере
3. Откройте консоль разработчика (F12)
4. Проверьте, что `window.CONFIG` содержит правильные значения
5. Проверьте, что нет ошибок загрузки `/api/config`

## Troubleshooting

### Ошибка "Cannot read properties of undefined"

Если видите эту ошибку:
1. Проверьте, что все переменные добавлены в Vercel
2. Сделайте redeploy проекта
3. Очистите кеш браузера (Ctrl+Shift+R)

### Ошибка 500 на /api/config

Если API возвращает 500:
1. Проверьте логи в Vercel Dashboard → Deployments → Logs
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что `api/config.js` использует правильный синтаксис

### Fallback на статический config.js

Если `/api/config` не работает, приложение автоматически использует статический `site/config.js`. Это нормально для локальной разработки, но в production лучше использовать API endpoint.

## Безопасность

⚠️ **Важно**:
- Никогда не коммитьте `.env` файл в Git
- Не публикуйте `SUPABASE_SERVICE_ROLE_KEY` в публичном коде
- Регулярно ротируйте секретные ключи
- Используйте разные ключи для development и production

## Дополнительные окружения

Для staging или preview окружений:

```bash
# Добавить для preview
vercel env add SUPABASE_URL preview

# Добавить для development
vercel env add SUPABASE_URL development
```

---

**Готово!** Теперь ваше приложение настроено и готово к работе 🚀
