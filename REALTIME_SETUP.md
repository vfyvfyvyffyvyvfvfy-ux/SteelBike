# Настройка Supabase Realtime

## Проблема: Realtime не работает

Если вы видите в консоли:
- `📡 Realtime статус: CHANNEL_ERROR`
- `❌ Ошибка подключения к Realtime каналу`
- Или сообщения не приходят в реальном времени

## Решение

### Способ 1: Через Supabase Dashboard (Рекомендуется)

1. Откройте [supabase.com](https://supabase.com)
2. Перейдите в ваш проект
3. Откройте **Database** → **Replication**
4. Найдите таблицу `support_messages`
5. Включите переключатель **Enable Realtime**
6. Повторите для других таблиц:
   - `clients`
   - `rentals`
   - `bikes`
   - `payments`
   - `bookings`

### Способ 2: Через SQL Editor

1. Откройте **SQL Editor** в Supabase Dashboard
2. Скопируйте и запустите содержимое файла `enable_realtime.sql`
3. Проверьте результат - должны увидеть список таблиц с включенным Realtime

### Способ 3: Через SQL команду (быстрый)

```sql
-- Включить Realtime для support_messages
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- Проверить
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

## Проверка работы Realtime

### 1. Проверьте в консоли браузера

После перезагрузки страницы вы должны увидеть:

```
🔌 Supabase Realtime инициализирован
📡 Realtime статус: SUBSCRIBED
✅ УСПЕШНО ПОДПИСАН НА ВСЕ ОБНОВЛЕНИЯ ЧАТА ПОДДЕРЖКИ!
```

### 2. Тест в реальном времени

Откройте два окна браузера:
1. **Окно 1**: Админ панель поддержки (`admin_support.html`)
2. **Окно 2**: Supabase Dashboard → Table Editor → `support_messages`

В **Окне 2** добавьте новую запись в таблицу `support_messages`:
```sql
INSERT INTO support_messages (client_id, sender, message_text, is_read)
VALUES (
  (SELECT id FROM clients LIMIT 1),
  'client',
  'Тестовое сообщение',
  false
);
```

В **Окне 1** вы должны сразу увидеть:
- Обновление списка чатов
- Новое сообщение (если чат открыт)
- В консоли: `Пришло обновление из чата: {...}`

### 3. Проверка через JavaScript

Откройте консоль браузера на странице `admin_support.html` и выполните:

```javascript
// Проверить статус канала
const channels = supabase.getChannels();
console.log('Активные каналы:', channels);

// Проверить подписки
channels.forEach(channel => {
  console.log('Канал:', channel.topic);
  console.log('Статус:', channel.state);
});
```

## Troubleshooting

### Ошибка: "CHANNEL_ERROR"

**Причины:**
1. Realtime не включен для таблицы
2. RLS (Row Level Security) блокирует доступ
3. Неправильные права доступа

**Решение:**

#### 1. Включите Realtime (см. выше)

#### 2. Проверьте RLS политики

```sql
-- Посмотреть политики для support_messages
SELECT * FROM pg_policies 
WHERE tablename = 'support_messages';
```

Если политик нет или они слишком строгие, создайте открытую политику:

```sql
-- Разрешить чтение всем
CREATE POLICY "allow_read_support_messages"
ON support_messages FOR SELECT
TO public
USING (true);
```

#### 3. Проверьте права на таблицу

```sql
-- Дать права на чтение
GRANT SELECT ON support_messages TO anon;
GRANT SELECT ON support_messages TO authenticated;
```

### Ошибка: "TIMED_OUT"

**Причины:**
1. Медленное интернет-соединение
2. Проблемы с Supabase сервером
3. Firewall блокирует WebSocket

**Решение:**
1. Проверьте интернет-соединение
2. Попробуйте перезагрузить страницу
3. Проверьте, не блокирует ли firewall WebSocket соединения

### Сообщения не приходят, но статус "SUBSCRIBED"

**Причины:**
1. Фильтр в подписке слишком строгий
2. События не генерируются
3. RLS блокирует чтение

**Решение:**

Проверьте фильтр подписки:

```javascript
// Текущий код
supportChannel.on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'support_messages'
}, payload => {
  console.log('Событие:', payload);
});
```

Попробуйте упростить:

```javascript
// Упрощенная подписка (для теста)
supportChannel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'support_messages'
}, payload => {
  console.log('Новое сообщение:', payload);
});
```

### Realtime работает, но медленно

**Причины:**
1. Слишком много подписок
2. Большой объем данных
3. Медленная обработка событий

**Решение:**

1. Оптимизируйте обработчик событий:

```javascript
// Плохо: перезагружаем все данные
loadAllData(); // Медленно!

// Хорошо: обновляем только нужное
if (payload.eventType === 'INSERT') {
  addMessageToList(payload.new);
}
```

2. Используйте debounce для частых обновлений:

```javascript
let updateTimeout;
supportChannel.on('postgres_changes', {...}, payload => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    loadAllData();
  }, 500); // Обновляем не чаще раза в 500мс
});
```

## Альтернатива: Polling (если Realtime не работает)

Если Realtime никак не заработает, можно использовать polling:

```javascript
// Вместо Realtime подписки
let lastCheck = new Date();

setInterval(async () => {
  const { data } = await supabase
    .from('support_messages')
    .select('*')
    .gt('created_at', lastCheck.toISOString())
    .order('created_at', { ascending: false });
  
  if (data && data.length > 0) {
    console.log('Новые сообщения:', data);
    data.forEach(msg => renderMessage(msg));
    lastCheck = new Date();
  }
}, 3000); // Проверяем каждые 3 секунды
```

## Полезные команды для отладки

### Проверить Realtime в Supabase

```sql
-- Посмотреть, какие таблицы в Realtime
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Посмотреть все публикации
SELECT * FROM pg_publication;

-- Посмотреть подписчиков
SELECT * FROM pg_stat_replication;
```

### Проверить в браузере

```javascript
// Статус Supabase
console.log('Supabase:', window.supabase);

// Активные каналы
console.log('Каналы:', supabase.getChannels());

// Создать тестовый канал
const testChannel = supabase.channel('test');
testChannel.subscribe(status => {
  console.log('Тест канал:', status);
});
```

## Checklist

После настройки проверьте:

- [ ] Realtime включен для таблицы `support_messages` в Supabase Dashboard
- [ ] В консоли видно: `✅ УСПЕШНО ПОДПИСАН`
- [ ] При добавлении записи в БД событие приходит в браузер
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок в Supabase Logs

---

**Готово!** Realtime должен работать 🎉
