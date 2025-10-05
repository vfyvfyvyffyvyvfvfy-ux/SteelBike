-- ============================================
-- RLS Policies для support_messages
-- Открытый доступ для работы Realtime
-- ============================================

-- Включаем RLS для таблицы (если еще не включен)
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики
DROP POLICY IF EXISTS "support_messages_select_all" ON support_messages;
DROP POLICY IF EXISTS "support_messages_insert_all" ON support_messages;
DROP POLICY IF EXISTS "support_messages_update_all" ON support_messages;
DROP POLICY IF EXISTS "support_messages_delete_all" ON support_messages;

-- Создаем открытые политики для всех операций

-- SELECT - чтение сообщений
CREATE POLICY "support_messages_select_all"
ON support_messages FOR SELECT
TO public
USING (true);

-- INSERT - создание сообщений
CREATE POLICY "support_messages_insert_all"
ON support_messages FOR INSERT
TO public
WITH CHECK (true);

-- UPDATE - обновление сообщений (например, пометка как прочитанное)
CREATE POLICY "support_messages_update_all"
ON support_messages FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- DELETE - удаление сообщений
CREATE POLICY "support_messages_delete_all"
ON support_messages FOR DELETE
TO public
USING (true);

-- ============================================
-- Проверка политик
-- ============================================

SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN qual = 'true' THEN '✅ Открыто для всех'
        ELSE '⚠️ Есть ограничения'
    END as access_level
FROM pg_policies 
WHERE tablename = 'support_messages'
AND schemaname = 'public'
ORDER BY policyname;

-- ============================================
-- ГОТОВО!
-- ============================================

SELECT '✅ RLS политики для support_messages настроены!' as result;
