# Отладка Realtime - Пошаговая инструкция

## 🔍 Шаг 1: Проверьте, включен ли Realtime

В Supabase SQL Editor выполните:

```sql
-- Проверка, включен ли Realtime для support_messages
SELECT 
    tablename,
    'Realtime включен' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename = 'support_messages';
```

**Ожидаемый результат:**
```
tablename          | status
support_messages   | Realtime включен
```

**Если пусто** → Realtime НЕ включен. Выполните:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
```

## 🔍 Шаг 2: Проверьте RLS политики

```sql
-- Проверка RLS
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN 'RLS включен'
        ELSE 'RLS выключен'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'support_messages';
```

**Если RLS включен**, проверьте политики:
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'support_messages';
```

**Должны быть политики для SELECT, INSERT, UPDATE** или выключите RLS:
```sql
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;
```

## 🔍 Шаг 3: Проверьте в браузере

Откройте `admin_support.html` и в консоли (F12) выполните:

```javascript
// Проверка подключения
console.log('Supabase:', window.supabase);
console.log('CONFIG:', window.CONFIG);

// Тест Realtime
const testChannel = window.supabase
  .createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY)
  .channel('test-channel')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'support_messages'
  }, (payload) => {
    console.log('🎉 REALTIME РАБОТАЕТ!', payload);
  })
  .subscribe((status) => {
    console.log('Статус подписки:', status);
  });
```

**Ожидаемый вывод:**
```
Статус подписки: SUBSCRIBED
```

## 🔍 Шаг 4: Тест отправки сообщения

В консоли браузера:

```javascript
// Отправка тестового сообщения
const supabase = window.supabase.createClient(
  window.CONFIG.SUPABASE_URL, 
  window.CONFIG.SUPABASE_ANON_KEY
);

await supabase.from('support_messages').insert({
  sender: 'client',
  message_text: 'Тестовое сообщение',
  anonymous_chat_id: 'test-' + Date.now(),
  is_read: false
});

// Должно появиться: 🎉 REALTIME РАБОТАЕТ!
```

## ❌ Частые проблемы

### Проблема 1: "CHANNEL_ERROR"

**Причина:** Realtime не включен для таблицы

**Решение:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
```

### Проблема 2: "TIMED_OUT"

**Причина:** Проблемы с сетью или RLS блокирует доступ

**Решение:**
```sql
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;
```

### Проблема 3: Подписка успешна, но события не приходят

**Причина:** RLS политики блокируют чтение

**Решение:**
```sql
-- Создайте открытую политику
CREATE POLICY "Enable realtime for all" 
ON support_messages FOR SELECT 
USING (true);
```

### Проблема 4: "Invalid JWT"

**Причина:** Неправильный SUPABASE_ANON_KEY

**Решение:** Проверьте ключ в CONFIG:
```javascript
console.log(window.CONFIG.SUPABASE_ANON_KEY);
```

Должен начинаться с `eyJhbGci...`

## ✅ Полное решение (если ничего не помогло)

Выполните ВСЁ это в Supabase SQL Editor:

```sql
-- 1. Включаем Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- 2. Выключаем RLS (самый простой вариант)
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;

-- 3. Проверяем
SELECT 
    'support_messages' as table_name,
    CASE 
        WHEN 'support_messages' IN (
            SELECT tablename 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
        ) THEN '✅ Realtime ON'
        ELSE '❌ Realtime OFF'
    END as realtime_status,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS ON'
        ELSE '🔓 RLS OFF'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'support_messages';
```

**Ожидаемый результат:**
```
table_name        | realtime_status | rls_status
support_messages  | ✅ Realtime ON  | 🔓 RLS OFF
```

## 🆘 Если всё ещё не работает

1. Перезагрузите страницу (Ctrl+Shift+R)
2. Проверьте Network в DevTools - должны быть WebSocket соединения
3. Проверьте, что используется правильный Supabase URL
4. Попробуйте в режиме инкогнито

## 📞 Нужна помощь?

Скопируйте вывод этих команд:

```javascript
// В консоли браузера:
console.log('CONFIG:', window.CONFIG);
console.log('Supabase version:', window.supabase.VERSION);
```

```sql
-- В Supabase SQL Editor:
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'support_messages';
```

И отправьте результаты.
