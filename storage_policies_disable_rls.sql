-- ============================================
-- ОТКЛЮЧЕНИЕ RLS ДЛЯ STORAGE (МАКСИМАЛЬНО ОТКРЫТЫЙ ДОСТУП)
-- ВНИМАНИЕ: Это делает все файлы публично доступными!
-- Используйте только для разработки или если это действительно нужно
-- ============================================

-- ============================================
-- ВАРИАНТ 1: ОТКЛЮЧИТЬ RLS ПОЛНОСТЬЮ (НЕ РЕКОМЕНДУЕТСЯ ДЛЯ PRODUCTION)
-- ============================================

-- Отключить RLS для storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Отключить RLS для storage.buckets
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ВАРИАНТ 2: СДЕЛАТЬ ВСЕ BUCKETS ПУБЛИЧНЫМИ
-- ============================================

-- Сделать passports публичным
UPDATE storage.buckets 
SET public = true 
WHERE id = 'passports';

-- Сделать contracts публичным
UPDATE storage.buckets 
SET public = true 
WHERE id = 'contracts';

-- Сделать avatars публичным (если есть)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

-- ============================================
-- ПРОВЕРКА
-- ============================================

-- Проверить статус RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'storage'
AND tablename IN ('objects', 'buckets');

-- Проверить публичность buckets
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets;

SELECT 'RLS disabled! All storage is now publicly accessible.' as status;
