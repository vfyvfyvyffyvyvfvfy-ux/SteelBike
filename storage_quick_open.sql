-- ============================================
-- БЫСТРАЯ НАСТРОЙКА: ОТКРЫТЫЙ ДОСТУП К STORAGE
-- Скопируйте и запустите в Supabase SQL Editor
-- ============================================

-- 1. Создать buckets (если еще не созданы)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('passports', 'passports', true),
  ('contracts', 'contracts', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- 2. Удалить все существующие политики
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- 3. Создать одну универсальную политику "разрешить всё всем"
CREATE POLICY "allow_all_operations"
ON storage.objects
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Дать права всем ролям
GRANT ALL ON storage.objects TO anon, authenticated, service_role;
GRANT ALL ON storage.buckets TO anon, authenticated, service_role;

-- 5. Включить RLS (но с открытой политикой)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Готово!
SELECT '✅ Storage настроен! Все пользователи могут делать что угодно с файлами.' as status;
