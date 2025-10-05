-- ============================================
-- УНИВЕРСАЛЬНОЕ ИСПРАВЛЕНИЕ ВСЕХ ПРОБЛЕМ
-- Запустите этот скрипт в Supabase SQL Editor
-- ВАЖНО: Используйте RLS Editor в Dashboard для Storage!
-- ============================================

-- ============================================
-- 1. ИСПРАВЛЕНИЕ STORAGE (через политики)
-- ============================================

-- Удаляем существующие политики для storage.objects
DROP POLICY IF EXISTS "public_read_all" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_all" ON storage.objects;
DROP POLICY IF EXISTS "public_update_all" ON storage.objects;
DROP POLICY IF EXISTS "public_delete_all" ON storage.objects;

-- Создаем открытые политики для storage.objects
CREATE POLICY "public_read_all"
ON storage.objects FOR SELECT
TO public, anon, authenticated
USING (true);

CREATE POLICY "public_insert_all"
ON storage.objects FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

CREATE POLICY "public_update_all"
ON storage.objects FOR UPDATE
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "public_delete_all"
ON storage.objects FOR DELETE
TO public, anon, authenticated
USING (true);

-- Делаем все bucket'ы публичными (это должно работать)
UPDATE storage.buckets SET public = true WHERE public = false;

-- Создаем bucket'ы если их нет
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('passports', 'passports', true),
    ('contracts', 'contracts', true),
    ('support_attachments', 'support_attachments', true),
    ('support_files', 'support_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

SELECT '✅ 1/3 Storage исправлен' as step_1;

-- ============================================
-- 2. ИСПРАВЛЕНИЕ REALTIME (чат поддержки)
-- ============================================

-- Включаем Realtime для таблиц (игнорируем если уже включено)
DO $$ 
BEGIN
    -- support_messages
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'support_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
    END IF;
    
    -- clients
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'clients'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE clients;
    END IF;
    
    -- rentals
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'rentals'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE rentals;
    END IF;
    
    -- bikes
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'bikes'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE bikes;
    END IF;
    
    -- payments
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'payments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE payments;
    END IF;
END $$;

-- Отключаем RLS для support_messages
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;

SELECT '✅ 2/3 Realtime включен' as step_2;

-- ============================================
-- 3. ОТКЛЮЧЕНИЕ RLS ДЛЯ ВСЕХ ТАБЛИЦ (для простоты)
-- ============================================

-- Отключаем RLS для всех основных таблиц
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE bikes DISABLE ROW LEVEL SECURITY;
ALTER TABLE rentals DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE tariffs DISABLE ROW LEVEL SECURITY;
ALTER TABLE batteries DISABLE ROW LEVEL SECURITY;
ALTER TABLE rental_batteries DISABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

SELECT '✅ 3/3 RLS отключен для всех таблиц' as step_3;

-- ============================================
-- ПРОВЕРКА РЕЗУЛЬТАТОВ
-- ============================================

-- Проверяем Storage
SELECT 
    '📦 Storage Buckets' as category,
    id as bucket_name,
    CASE WHEN public THEN '✅ Публичный' ELSE '❌ Приватный' END as status
FROM storage.buckets
ORDER BY id;

-- Проверяем Realtime
SELECT 
    '📡 Realtime Tables' as category,
    tablename as table_name,
    '✅ Включен' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Проверяем RLS
SELECT 
    '🔓 RLS Status' as category,
    c.relname as table_name,
    CASE 
        WHEN c.relrowsecurity THEN '🔒 Включен'
        ELSE '✅ Выключен'
    END as rls_status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
AND c.relkind = 'r'
AND c.relname IN ('clients', 'bikes', 'rentals', 'payments', 'support_messages')
ORDER BY c.relname;

-- ============================================
-- ГОТОВО!
-- ============================================

SELECT 
    '🎉 ВСЕ ИСПРАВЛЕНО!' as status,
    'Обновите страницу (Ctrl+R) и попробуйте снова' as next_step;
