-- ============================================
-- Supabase Storage Policies - ПОЛНЫЙ ОТКРЫТЫЙ ДОСТУП
-- Позволяет всем пользователям делать что угодно с файлами
-- ============================================

-- ВАЖНО: Эти политики дают ПОЛНЫЙ доступ всем!
-- Используйте только для разработки или если это действительно необходимо

-- ============================================
-- BUCKET: passports
-- ============================================

-- Удаляем существующие политики
DROP POLICY IF EXISTS "passports_select_all" ON storage.objects;
DROP POLICY IF EXISTS "passports_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "passports_update_all" ON storage.objects;
DROP POLICY IF EXISTS "passports_delete_all" ON storage.objects;

-- Создаем новые открытые политики для passports
CREATE POLICY "passports_select_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'passports');

CREATE POLICY "passports_insert_all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'passports');

CREATE POLICY "passports_update_all"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'passports')
WITH CHECK (bucket_id = 'passports');

CREATE POLICY "passports_delete_all"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'passports');

-- ============================================
-- BUCKET: contracts
-- ============================================

-- Удаляем существующие политики
DROP POLICY IF EXISTS "contracts_select_all" ON storage.objects;
DROP POLICY IF EXISTS "contracts_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "contracts_update_all" ON storage.objects;
DROP POLICY IF EXISTS "contracts_delete_all" ON storage.objects;

-- Создаем новые открытые политики для contracts
CREATE POLICY "contracts_select_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'contracts');

CREATE POLICY "contracts_insert_all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "contracts_update_all"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'contracts')
WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "contracts_delete_all"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'contracts');

-- ============================================
-- BUCKET: support_attachments
-- ============================================

-- Удаляем существующие политики
DROP POLICY IF EXISTS "support_attachments_select_all" ON storage.objects;
DROP POLICY IF EXISTS "support_attachments_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "support_attachments_update_all" ON storage.objects;
DROP POLICY IF EXISTS "support_attachments_delete_all" ON storage.objects;

-- Создаем новые открытые политики для support_attachments
CREATE POLICY "support_attachments_select_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'support_attachments');

CREATE POLICY "support_attachments_insert_all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'support_attachments');

CREATE POLICY "support_attachments_update_all"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'support_attachments')
WITH CHECK (bucket_id = 'support_attachments');

CREATE POLICY "support_attachments_delete_all"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'support_attachments');

-- ============================================
-- BUCKET: support_files
-- ============================================

-- Удаляем существующие политики
DROP POLICY IF EXISTS "support_files_select_all" ON storage.objects;
DROP POLICY IF EXISTS "support_files_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "support_files_update_all" ON storage.objects;
DROP POLICY IF EXISTS "support_files_delete_all" ON storage.objects;

-- Создаем новые открытые политики для support_files
CREATE POLICY "support_files_select_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'support_files');

CREATE POLICY "support_files_insert_all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'support_files');

CREATE POLICY "support_files_update_all"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'support_files')
WITH CHECK (bucket_id = 'support_files');

CREATE POLICY "support_files_delete_all"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'support_files');

-- ============================================
-- УНИВЕРСАЛЬНАЯ ПОЛИТИКА (для всех bucket'ов)
-- ============================================

-- Если хотите дать доступ ко ВСЕМ bucket'ам сразу, раскомментируйте:

-- DROP POLICY IF EXISTS "all_buckets_select" ON storage.objects;
-- DROP POLICY IF EXISTS "all_buckets_insert" ON storage.objects;
-- DROP POLICY IF EXISTS "all_buckets_update" ON storage.objects;
-- DROP POLICY IF EXISTS "all_buckets_delete" ON storage.objects;

-- CREATE POLICY "all_buckets_select"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (true);

-- CREATE POLICY "all_buckets_insert"
-- ON storage.objects FOR INSERT
-- TO public
-- WITH CHECK (true);

-- CREATE POLICY "all_buckets_update"
-- ON storage.objects FOR UPDATE
-- TO public
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "all_buckets_delete"
-- ON storage.objects FOR DELETE
-- TO public
-- USING (true);

-- ============================================
-- ПРОВЕРКА ПОЛИТИК
-- ============================================

-- Посмотреть все политики для storage.objects
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- ГОТОВО!
-- ============================================

SELECT 'Storage policies created successfully! All users have full access.' as status;
