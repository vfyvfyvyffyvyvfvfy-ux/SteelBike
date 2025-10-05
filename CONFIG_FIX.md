# Исправление проблемы с config.js

## ❌ Проблема
```
GET https://steel-bike.vercel.app/config.js net::ERR_ABORTED 404 (Not Found)
```

## ✅ Решение

### Что было сделано:

1. **Изменен путь загрузки config.js** с `config.js` на `./config.js` (относительный путь)
2. **Добавлен fallback механизм** - сначала загружается статический файл, потом API
3. **Обновлены все HTML файлы**:
   - ✅ `site/index.html`
   - ✅ `site/admin.html`
   - ✅ `site/admin_support.html`
   - ✅ `site/map.html`
   - ✅ `site/profile.html`
   - ✅ `site/stats.html`
   - ✅ `site/recover.html`

### Новый код в HTML:

```html
<!-- Load static config as fallback first -->
<script src="./config.js"></script>
<!-- Then try to load dynamic config from API (will override if successful) -->
<script src="/api/config" onerror="console.log('Using static config.js as fallback')"></script>
```

### Как это работает:

1. **Первый скрипт** (`./config.js`) - загружает статический файл из той же папки
2. **Второй скрипт** (`/api/config`) - пытается загрузить динамическую конфигурацию из API
3. **Если API не работает** - используется статический файл (fallback)
4. **Если API работает** - переопределяет значения из статического файла

## 🧪 Проверка

### Локально:

1. Откройте любую страницу (например, `admin_support.html`)
2. Откройте консоль (F12)
3. Проверьте:

```javascript
console.log(window.CONFIG);
// Должен вывести объект с ключами
```

### На Vercel:

1. Сделайте commit и push:
```bash
git add .
git commit -m "Fix config.js loading path"
git push
```

2. Дождитесь деплоя на Vercel

3. Откройте сайт и проверьте консоль

## 📋 Что проверить после деплоя:

- [ ] `window.CONFIG` определен
- [ ] `window.CONFIG.SUPABASE_URL` содержит правильный URL
- [ ] `window.CONFIG.SUPABASE_ANON_KEY` содержит ключ
- [ ] Нет ошибок 404 для `config.js`
- [ ] Supabase подключается успешно

## 🔧 Если всё ещё не работает:

### Вариант 1: Проверьте структуру файлов

Убедитесь, что `config.js` находится в папке `site/`:

```
project/
├── site/
│   ├── config.js          ← Должен быть здесь
│   ├── index.html
│   ├── admin.html
│   ├── admin_support.html
│   └── ...
├── api/
│   └── config.js
└── vercel.json
```

### Вариант 2: Проверьте содержимое config.js

Откройте `site/config.js` и убедитесь, что он содержит:

```javascript
window.CONFIG = {
    SUPABASE_URL: 'https://qjrycnazrzetnciyqakm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGci...',
    // ... остальные ключи
};

const CONFIG = window.CONFIG;
```

### Вариант 3: Используйте абсолютный путь

Если относительный путь не работает, попробуйте:

```html
<script src="/config.js"></script>
```

Но тогда нужно добавить в `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/config.js",
      "destination": "/site/config.js"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/site/$1"
    }
  ]
}
```

### Вариант 4: Встроенная конфигурация

Если ничего не помогает, можно встроить конфигурацию прямо в HTML:

```html
<script>
window.CONFIG = {
    SUPABASE_URL: 'https://qjrycnazrzetnciyqakm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGci...',
    // ... остальные ключи
};
const CONFIG = window.CONFIG;
</script>
```

## 📞 Дополнительная диагностика

Запустите в консоли браузера:

```javascript
// Проверка загрузки файлов
fetch('./config.js')
  .then(r => r.text())
  .then(t => console.log('config.js content:', t))
  .catch(e => console.error('config.js error:', e));

// Проверка API
fetch('/api/config')
  .then(r => r.text())
  .then(t => console.log('API config content:', t))
  .catch(e => console.error('API config error:', e));

// Проверка CONFIG
console.log('window.CONFIG:', window.CONFIG);
```

---

**После этих изменений config.js должен загружаться корректно!** 🚀
