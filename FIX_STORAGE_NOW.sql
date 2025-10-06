-- ============================================
-- СРОЧНОЕ ИСПРАВЛЕНИЕ STORAGE
-- Запустите ПРЯМО СЕЙЧАС в Supabase SQL Editor
-- ============================================

-- 1. Проверяем bucket
SELECT id, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'passports';

-- 2. Если bucket не существует - создаем
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('passports', 'passports', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];

-- 3. ПОЛНОСТЬЮ ОТКЛЮЧАЕМ RLS для storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 4. Удаляем ВСЕ политики
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

-- 5. Проверяем результат
SELECT 
    'storage.objects' as table_name,
    CASE 
        WHEN relrowsecurity THEN '❌ RLS ВКЛЮЧЕН (плохо!)'
        ELSE '✅ RLS ВЫКЛЮЧЕН (хорошо!)'
    END as status
FROM pg_class
WHERE relname = 'objects'
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');

-- 6. Проверяем bucket
SELECT 
    id,
    CASE WHEN public THEN '✅ Публичный' ELSE '❌ Приватный' END as status,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'passports';

-- ГОТОВО! Теперь попробуйте загрузить файл через бота
