-- ============================================
-- БЫСТРОЕ ИСПРАВЛЕНИЕ REALTIME
-- Запустите этот скрипт в Supabase SQL Editor
-- ============================================

-- 1. Включаем Realtime для support_messages
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- 2. Убираем RLS (или делаем открытые политики)
ALTER TABLE support_messages DISABLE ROW LEVEL SECURITY;

-- ИЛИ если хотите оставить RLS, создайте открытые политики:
-- DROP POLICY IF EXISTS "Enable read access for all users" ON support_messages;
-- CREATE POLICY "Enable read access for all users" ON support_messages FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for all users" ON support_messages FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update for all users" ON support_messages FOR UPDATE USING (true);

-- 3. Проверка
SELECT 
    'support_messages' as table_name,
    CASE 
        WHEN 'support_messages' IN (
            SELECT tablename 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime'
        ) THEN '✅ Realtime включен'
        ELSE '❌ Realtime выключен'
    END as status;

-- ГОТОВО! Теперь обновите страницу admin_support.html
