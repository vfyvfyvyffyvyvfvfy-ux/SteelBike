-- ============================================
-- Supabase Storage - ПРОСТАЯ УНИВЕРСАЛЬНАЯ ПОЛИТИКА
-- Один скрипт для полного доступа ко всем bucket'ам
-- ============================================

-- ⚠️ ВНИМАНИЕ: Это дает ПОЛНЫЙ доступ всем пользователям!
-- Используйте только если понимаете риски безопасности

-- ============================================
-- Шаг 1: Удаляем ВСЕ существующие политики
-- ============================================

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- ============================================
-- Шаг 2: Создаем универсальные политики
-- ============================================

-- Политика для чтения (SELECT)
CREATE POLICY "public_read_all"
ON storage.objects FOR SELECT
TO public
USING (true);

-- Политика для загрузки (INSERT)
CREATE POLICY "public_insert_all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (true);

-- Политика для обновления (UPDATE)
CREATE POLICY "public_update_all"
ON storage.objects FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Политика для удаления (DELETE)
CREATE POLICY "public_delete_all"
ON storage.objects FOR DELETE
TO public
USING (true);

-- ============================================
-- Шаг 3: Убедимся, что bucket'ы публичные
-- ============================================

-- Обновляем все bucket'ы, делая их публичными
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('passports', 'contracts', 'support_attachments', 'support_files');

-- ============================================
-- Проверка результата
-- ============================================

-- Показать все политики
SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN qual = 'true' THEN '✅ Открыто для всех'
        ELSE '⚠️ Есть ограничения'
    END as access_level
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Показать статус bucket'ов
SELECT 
    id as bucket_name,
    CASE 
        WHEN public THEN '✅ Публичный'
        ELSE '🔒 Приватный'
    END as status,
    created_at
FROM storage.buckets
ORDER BY id;

-- ============================================
-- ГОТОВО!
-- ============================================

SELECT '✅ Storage полностью открыт! Все пользователи имеют полный доступ.' as result;
