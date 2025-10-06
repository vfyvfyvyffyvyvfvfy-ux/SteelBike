# 🔧 Исправление Storage через Dashboard

## ⚠️ Проблема
Файлы не загружаются в Storage из-за RLS политик.

## ✅ Решение (через Supabase Dashboard)

### Шаг 1: Откройте Storage

1. Откройте [supabase.com](https://supabase.com)
2. Выберите ваш проект
3. Перейдите в **Storage** (левое меню)

### Шаг 2: Проверьте bucket "passports"

1. Найдите bucket `passports` в списке
2. Если его нет - создайте:
   - Нажмите **New bucket**
   - Name: `passports`
   - ✅ Public bucket (включите!)
   - Create bucket

### Шаг 3: Настройте политики

1. Нажмите на bucket `passports`
2. Перейдите на вкладку **Policies**
3. Нажмите **New Policy**
4. Выберите **For full customization**

#### Политика 1: SELECT (чтение)
```
Policy name: Allow public read
Allowed operation: SELECT
Target roles: public
USING expression: true
```

#### Политика 2: INSERT (загрузка)
```
Policy name: Allow public insert
Allowed operation: INSERT
Target roles: public
WITH CHECK expression: true
```

#### Политика 3: UPDATE (обновление)
```
Policy name: Allow public update
Allowed operation: UPDATE
Target roles: public
USING expression: true
WITH CHECK expression: true
```

#### Политика 4: DELETE (удаление)
```
Policy name: Allow public delete
Allowed operation: DELETE
Target roles: public
USING expression: true
```

### Шаг 4: Сохраните и проверьте

1. Нажмите **Save** для каждой политики
2. Убедитесь, что все 4 политики созданы
3. Bucket должен быть **Public**

## 🧪 Тест

Попробуйте загрузить файл вручную:

1. В Storage → passports
2. Нажмите **Upload file**
3. Выберите любую картинку
4. Если загружается - всё работает! ✅

## 🚀 Теперь попробуйте бота

Перезапустите бота и попробуйте зарегистрироваться снова!

---

**Если всё ещё не работает:**

Проверьте в логах бота строку:
```
✅ Upload response for passport_main: ...
```

Если там ошибка - скопируйте её и отправьте мне.
