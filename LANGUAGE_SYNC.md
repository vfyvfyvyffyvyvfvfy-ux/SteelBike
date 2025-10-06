# 🌍 Синхронизация языка между ботом и веб-приложением

## Проблема:
Пользователь выбирает английский язык в боте, но веб-приложение открывается на русском.

## ✅ Решение реализовано:

### 1. Бот передает язык через URL
```python
# При завершении регистрации
app_url_with_lang = f"{WEB_APP_URL}?lang={lang}"
keyboard = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text=t('open_app', lang), web_app=WebAppInfo(url=app_url_with_lang))]
])
```

### 2. Язык сохраняется в базе данных
Язык автоматически сохраняется в поле `extra.language` при регистрации через бота.

### 3. Веб-приложение читает язык из URL
```javascript
// В translations.js
const urlParams = new URLSearchParams(window.location.search);
const langFromUrl = urlParams.get('lang');
if (langFromUrl && (langFromUrl === 'ru' || langFromUrl === 'en')) {
  setUserLanguage(langFromUrl);
}
```

### 4. Язык сохраняется в localStorage при авторизации
```javascript
// В index.html при успешной авторизации
if (data.user.extra && data.user.extra.language) {
    localStorage.setItem('userLanguage', data.user.extra.language);
}
```

## 🔄 Как это работает:

### Сценарий 1: Первый вход после регистрации
1. Пользователь выбирает язык в боте (например, English)
2. Язык сохраняется в `formData.language`
3. После регистрации бот отправляет ссылку: `https://steel-bike.vercel.app/?lang=en`
4. Веб-приложение читает `?lang=en` из URL
5. Устанавливает английский язык
6. Сохраняет в localStorage
7. При авторизации также сохраняет из базы данных

### Сценарий 2: Повторный вход
1. Пользователь открывает приложение
2. При авторизации читается `extra.language` из базы
3. Язык устанавливается автоматически
4. Сохраняется в localStorage

### Сценарий 3: Переключение в профиле
1. Пользователь заходит в профиль
2. Нажимает 🇬🇧 или 🇷🇺
3. Язык сохраняется в localStorage
4. Применяется на всех страницах

## 📊 Приоритет источников языка:

1. **URL параметр** `?lang=en` (самый высокий приоритет)
2. **localStorage** `userLanguage`
3. **По умолчанию** `ru`

## 🔧 Технические детали:

### В боте (bot.py):
```python
# Язык сохраняется в state
await state.update_data(language=lang)

# Передается через URL
app_url_with_lang = f"{WEB_APP_URL}?lang={lang}"

# Сохраняется в formData и отправляется на сервер
api_data = {
    "action": "bot-register",
    "userId": user_id,
    "formData": user_data  # Включает language
}
```

### В API (api/auth.js):
```javascript
// Язык автоматически сохраняется в extra
const extra = {
    ...otherData,  // Включает language
    telegram_user_id: telegram_user_id,
    video_selfie_storage_path: video_note_storage_path,
};

// Сохраняется в базу
await supabaseAdmin.from("clients").insert([{
    name,
    phone,
    city: otherData.city,
    extra,  // Здесь есть language
    ...
}])
```

### В веб-приложении (site/):

**translations.js:**
```javascript
// Читаем из URL при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  if (langFromUrl) {
    setUserLanguage(langFromUrl);
  }
  updatePageLanguage();
});
```

**index.html:**
```javascript
// Сохраняем из базы при авторизации
if (data.user.extra && data.user.extra.language) {
    localStorage.setItem('userLanguage', data.user.extra.language);
}
```

## ✅ Результат:

Теперь язык **синхронизируется** между ботом и веб-приложением:

1. ✅ Выбрал English в боте → веб-приложение на английском
2. ✅ Выбрал Русский в боте → веб-приложение на русском
3. ✅ Переключил в профиле → сохраняется для всех страниц
4. ✅ Закрыл и открыл снова → язык сохранился

## 🎯 Что проверить:

1. Зарегистрируйтесь в боте, выбрав English
2. Нажмите "Open App" в боте
3. Проверьте что приложение открылось на английском
4. Закройте и откройте снова
5. Язык должен остаться английским

---

**Готово!** Язык теперь полностью синхронизирован между ботом и веб-приложением! 🎉
