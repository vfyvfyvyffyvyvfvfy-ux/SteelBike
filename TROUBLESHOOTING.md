# Troubleshooting - Решение проблем

## ❌ Проблема: "CONFIG is not loaded" или "Cannot read properties of undefined"

### Симптомы:
- В консоли браузера ошибка: `Cannot read properties of undefined (reading 'SUPABASE_URL')`
- Алерт: "Configuration error. Please check console."
- Страница не загружается или не работает

### Причины:
1. Файл `config.js` не загружен
2. API endpoint `/api/config` возвращает ошибку 500
3. Переменные окружения не установлены в Vercel

### Решение:

#### Шаг 1: Проверьте консоль браузера

Откройте DevTools (F12) и проверьте:

```javascript
// В консоли браузера введите:
console.log(window.CONFIG);
```

**Если видите объект с ключами** → CONFIG загружен ✅  
**Если видите `undefined`** → CONFIG не загружен ❌

#### Шаг 2: Проверьте загрузку файлов

В DevTools → Network проверьте:
- ✅ `config.js` - должен загрузиться со статусом 200
- ⚠️ `/api/config` - может быть 500 (это нормально, если есть fallback)

#### Шаг 3: Проверьте HTML файлы

Убедитесь, что в `<head>` есть:

```html
<!-- Load static config as fallback first -->
<script src="config.js"></script>
<!-- Then try to load dynamic config from API -->
<script src="/api/config" onerror="console.log('Using static config.js as fallback')"></script>
```

Это должно быть в:
- ✅ `site/index.html`
- ✅ `site/admin.html`
- ✅ `site/admin_support.html`
- ✅ `site/map.html`
- ✅ `site/profile.html`
- ✅ `site/stats.html`

#### Шаг 4: Проверьте site/config.js

Откройте `site/config.js` и убедитесь, что он содержит:

```javascript
window.CONFIG = {
    SUPABASE_URL: 'https://qjrycnazrzetnciyqakm.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGci...',
    // ... остальные ключи
};

const CONFIG = window.CONFIG;
```

#### Шаг 5: Очистите кеш браузера

1. Нажмите `Ctrl + Shift + R` (Windows) или `Cmd + Shift + R` (Mac)
2. Или откройте DevTools → Network → поставьте галочку "Disable cache"
3. Обновите страницу

#### Шаг 6: Проверьте Vercel переменные окружения

Если `/api/config` возвращает 500:

1. Откройте [vercel.com](https://vercel.com)
2. Перейдите в Settings → Environment Variables
3. Убедитесь, что установлены:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Остальные переменные из `.env.example`

4. Если переменные не установлены, добавьте их
5. Сделайте redeploy: `vercel --prod`

## ❌ Проблема: Supabase не подключается

### Симптомы:
- Ошибки в консоли: "Failed to fetch"
- Данные не загружаются
- Таблицы пустые

### Решение:

#### Проверьте Supabase URL

```javascript
// В консоли браузера:
console.log(window.CONFIG.SUPABASE_URL);
// Должно быть: https://qjrycnazrzetnciyqakm.supabase.co
```

#### Проверьте Supabase ключи

```javascript
// В консоли браузера:
console.log(window.CONFIG.SUPABASE_ANON_KEY);
// Должен быть длинный JWT токен
```

#### Проверьте подключение к Supabase

```javascript
// В консоли браузера:
const supabase = window.supabase.createClient(
  window.CONFIG.SUPABASE_URL,
  window.CONFIG.SUPABASE_ANON_KEY
);

// Попробуйте простой запрос
const { data, error } = await supabase.from('clients').select('*').limit(1);
console.log('Data:', data);
console.log('Error:', error);
```

**Если видите данные** → Supabase работает ✅  
**Если видите ошибку** → Проверьте:
- Правильность URL и ключей
- Существование таблицы `clients`
- RLS политики (Row Level Security)

## ❌ Проблема: Storage не работает

### Симптомы:
- Ошибка: "new row violates row-level security policy"
- Файлы не загружаются
- Ошибка 403 при доступе к файлам

### Решение:

#### Примените политики Storage

1. Откройте Supabase Dashboard → SQL Editor
2. Запустите `storage_policies_simple.sql`
3. Проверьте результат:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

Должны быть 4 политики:
- `public_read_all` (SELECT)
- `public_insert_all` (INSERT)
- `public_update_all` (UPDATE)
- `public_delete_all` (DELETE)

#### Проверьте bucket'ы

```sql
SELECT id, public FROM storage.buckets;
```

Все bucket'ы должны быть `public = true`

#### Тест загрузки файла

```javascript
// В консоли браузера:
const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });

const { data, error } = await supabase.storage
  .from('passports')
  .upload('test/test.txt', testFile);

console.log('Upload result:', { data, error });
```

## ❌ Проблема: API возвращает 500

### Симптомы:
- В Network видно: `/api/user` → 500
- В консоли: "Failed to load resource: the server responded with a status of 500"

### Решение:

#### Проверьте логи Vercel

1. Откройте [vercel.com](https://vercel.com)
2. Перейдите в Deployments → Latest → Logs
3. Найдите ошибку в логах
4. Исправьте проблему в коде
5. Сделайте redeploy

#### Проверьте переменные окружения в API

API функции используют `process.env.*`. Убедитесь, что все переменные установлены в Vercel.

#### Проверьте синтаксис API функций

```bash
# Локально проверьте синтаксис:
npm install
node -c api/user.js
node -c api/admin.js
node -c api/auth.js
```

## ❌ Проблема: База данных не создается

### Симптомы:
- Ошибка: "relation does not exist"
- Таблицы не найдены

### Решение:

#### Примените схему БД

1. Откройте Supabase Dashboard → SQL Editor
2. Запустите `database_full_schema.sql`
3. Дождитесь сообщения: "Full schema created successfully!"

#### Проверьте таблицы

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Должны быть таблицы:
- `clients`
- `bikes`
- `rentals`
- `payments`
- `tariffs`
- `bookings`
- `batteries`
- `support_messages`
- `contract_templates`
- `app_settings`

## 🆘 Быстрая диагностика

Запустите этот скрипт в консоли браузера для полной диагностики:

```javascript
console.log('=== ДИАГНОСТИКА СИСТЕМЫ ===');

// 1. CONFIG
console.log('1. CONFIG:', window.CONFIG ? '✅ Загружен' : '❌ Не загружен');
if (window.CONFIG) {
  console.log('   SUPABASE_URL:', window.CONFIG.SUPABASE_URL);
  console.log('   SUPABASE_ANON_KEY:', window.CONFIG.SUPABASE_ANON_KEY ? '✅ Есть' : '❌ Нет');
}

// 2. Supabase Library
console.log('2. Supabase Library:', window.supabase ? '✅ Загружена' : '❌ Не загружена');

// 3. Supabase Client
if (window.CONFIG && window.supabase) {
  try {
    const supabase = window.supabase.createClient(
      window.CONFIG.SUPABASE_URL,
      window.CONFIG.SUPABASE_ANON_KEY
    );
    console.log('3. Supabase Client:', '✅ Создан');
    
    // 4. Test connection
    supabase.from('clients').select('count').limit(1).then(({ data, error }) => {
      if (error) {
        console.log('4. Подключение к БД:', '❌ Ошибка:', error.message);
      } else {
        console.log('4. Подключение к БД:', '✅ Работает');
      }
    });
  } catch (e) {
    console.log('3. Supabase Client:', '❌ Ошибка:', e.message);
  }
}

console.log('=== КОНЕЦ ДИАГНОСТИКИ ===');
```

## 📞 Нужна помощь?

Если проблема не решена:

1. Скопируйте вывод диагностики из консоли
2. Сделайте скриншот ошибки
3. Проверьте логи Vercel
4. Опишите, что вы делали перед ошибкой

---

**Большинство проблем решается:**
1. Очисткой кеша (Ctrl+Shift+R)
2. Проверкой переменных окружения в Vercel
3. Применением схемы БД и политик Storage
