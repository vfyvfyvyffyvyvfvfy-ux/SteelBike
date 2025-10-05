# Настройка Supabase Storage - Полный доступ

## 🎯 Цель
Настроить политики безопасности так, чтобы любой пользователь мог загружать, читать, обновлять и удалять файлы из всех bucket'ов.

## ⚠️ Предупреждение о безопасности

**Эти политики дают ПОЛНЫЙ доступ всем пользователям!**

Используйте только если:
- Это development/staging окружение
- Вы понимаете риски безопасности
- У вас есть другие механизмы защиты (например, аутентификация на уровне приложения)

## 📋 Два варианта настройки

### Вариант 1: Простой (Рекомендуется) ⭐

Используйте файл `storage_policies_simple.sql` - он автоматически:
- Удаляет все существующие политики
- Создает 4 универсальные политики для всех операций
- Делает все bucket'ы публичными

```bash
# В Supabase SQL Editor:
1. Откройте файл storage_policies_simple.sql
2. Скопируйте весь код
3. Вставьте в SQL Editor
4. Нажмите Run (или Ctrl+Enter)
```

### Вариант 2: Детальный

Используйте файл `storage_policies_open.sql` - он создает отдельные политики для каждого bucket'а:
- `passports` - документы пользователей
- `contracts` - договоры
- `support_attachments` - вложения поддержки
- `support_files` - файлы поддержки

## 🚀 Пошаговая инструкция

### Шаг 1: Откройте Supabase Dashboard

1. Перейдите на [supabase.com](https://supabase.com)
2. Откройте ваш проект
3. Перейдите в **SQL Editor**

### Шаг 2: Создайте bucket'ы (если еще не созданы)

```sql
-- Создать bucket для паспортов
INSERT INTO storage.buckets (id, name, public)
VALUES ('passports', 'passports', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Создать bucket для договоров
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Создать bucket для вложений поддержки
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_attachments', 'support_attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Создать bucket для файлов поддержки
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_files', 'support_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### Шаг 3: Примените политики

Выберите один из вариантов:

**Простой способ:**
```sql
-- Скопируйте и запустите содержимое storage_policies_simple.sql
```

**Детальный способ:**
```sql
-- Скопируйте и запустите содержимое storage_policies_open.sql
```

### Шаг 4: Проверьте результат

```sql
-- Проверить политики
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Проверить bucket'ы
SELECT id, public, created_at 
FROM storage.buckets;
```

Вы должны увидеть:
- ✅ 4 политики (SELECT, INSERT, UPDATE, DELETE) с `qual = true`
- ✅ Все bucket'ы с `public = true`

## 🧪 Тестирование

### Через JavaScript (в браузере)

```javascript
// Инициализация Supabase
const supabase = window.supabase.createClient(
  'https://qjrycnazrzetnciyqakm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ваш ANON_KEY
);

// Тест загрузки файла
const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

const { data, error } = await supabase.storage
  .from('passports')
  .upload('test/test.txt', testFile);

if (error) {
  console.error('❌ Ошибка:', error);
} else {
  console.log('✅ Файл загружен:', data);
}

// Тест чтения файла
const { data: url } = supabase.storage
  .from('passports')
  .getPublicUrl('test/test.txt');

console.log('📎 Публичная ссылка:', url);

// Тест удаления файла
const { error: deleteError } = await supabase.storage
  .from('passports')
  .remove(['test/test.txt']);

if (deleteError) {
  console.error('❌ Ошибка удаления:', deleteError);
} else {
  console.log('✅ Файл удален');
}
```

### Через cURL

```bash
# Загрузка файла
curl -X POST \
  'https://qjrycnazrzetnciyqakm.supabase.co/storage/v1/object/passports/test.txt' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: text/plain' \
  --data 'test content'

# Получение файла
curl 'https://qjrycnazrzetnciyqakm.supabase.co/storage/v1/object/public/passports/test.txt'

# Удаление файла
curl -X DELETE \
  'https://qjrycnazrzetnciyqakm.supabase.co/storage/v1/object/passports/test.txt' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

## 🔧 Troubleshooting

### Ошибка "new row violates row-level security policy"

**Решение:**
1. Убедитесь, что политики применены правильно
2. Проверьте, что bucket существует
3. Попробуйте пересоздать политики (запустите скрипт еще раз)

### Ошибка "Bucket not found"

**Решение:**
```sql
-- Создайте bucket вручную
INSERT INTO storage.buckets (id, name, public)
VALUES ('your_bucket_name', 'your_bucket_name', true);
```

### Файлы не загружаются

**Проверьте:**
1. Bucket существует: `SELECT * FROM storage.buckets;`
2. Политики созданы: `SELECT * FROM pg_policies WHERE tablename = 'objects';`
3. Bucket публичный: `UPDATE storage.buckets SET public = true WHERE id = 'your_bucket';`

### Нужно вернуть ограничения

Если нужно вернуть безопасные политики:

```sql
-- Удалить все открытые политики
DROP POLICY IF EXISTS "public_read_all" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "public_update_all" ON storage.objects;
DROP POLICY IF EXISTS "public_delete_all" ON storage.objects;

-- Создать политику только для аутентифицированных пользователей
CREATE POLICY "authenticated_users_only"
ON storage.objects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

## 📚 Дополнительные ресурсы

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies Examples](https://supabase.com/docs/guides/storage/security/access-control)

## ✅ Checklist

После настройки убедитесь:

- [ ] Все bucket'ы созданы
- [ ] Политики применены (4 политики: SELECT, INSERT, UPDATE, DELETE)
- [ ] Bucket'ы публичные (`public = true`)
- [ ] Тестовая загрузка работает
- [ ] Тестовое чтение работает
- [ ] Тестовое удаление работает

---

**Готово!** Теперь любой пользователь может работать с файлами в Storage 🎉
