# Настройка мультиязычности SteelBike

## Что сделано:

### 1. Бот (bot.py)
✅ Добавлен выбор языка в начале регистрации (после /start?register)
✅ Пользователь выбирает: 🇷🇺 Русский или 🇬🇧 English
✅ Язык сохраняется в FSM и используется во всех сообщениях бота
✅ Файл переводов: `translations.json`

### 2. Фронтенд
✅ Создан файл `site/translations.js` с переводами
✅ Язык сохраняется в localStorage
✅ Функции для работы с переводами:
  - `t(key, lang)` - получить перевод
  - `getUserLanguage()` - получить текущий язык
  - `setUserLanguage(lang)` - установить язык
  - `updatePageLanguage()` - обновить все элементы на странице

## Как использовать на фронтенде:

### Вариант 1: Через data-атрибуты (автоматически)
```html
<h1 data-i18n="welcome"></h1>
<button data-i18n="rent_now"></button>
<input data-i18n-placeholder="enter_name" />
```

### Вариант 2: Через JavaScript
```javascript
const lang = getUserLanguage(); // 'ru' или 'en'
document.getElementById('title').textContent = t('welcome', lang);
```

### Добавить кнопку переключения языка:
```html
<div class="language-switcher">
  <button onclick="setUserLanguage('ru')">🇷🇺 RU</button>
  <button onclick="setUserLanguage('en')">🇬🇧 EN</button>
</div>
```

## Как добавить новые переводы:

### В боте (translations.json):
```json
{
  "ru": {
    "new_key": "Новый текст"
  },
  "en": {
    "new_key": "New text"
  }
}
```

### На фронтенде (site/translations.js):
```javascript
const translations = {
  ru: {
    new_key: 'Новый текст'
  },
  en: {
    new_key: 'New text'
  }
};
```

## Что нужно сделать дальше:

### 1. Добавить переключатель языка на каждую страницу
Добавьте в header каждой страницы:
```html
<div class="lang-switch" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
  <button onclick="setUserLanguage('ru')" style="padding: 8px 12px; border: none; background: #fff; border-radius: 8px; cursor: pointer;">🇷🇺</button>
  <button onclick="setUserLanguage('en')" style="padding: 8px 12px; border: none; background: #fff; border-radius: 8px; cursor: pointer;">🇬🇧</button>
</div>
```

### 2. Обновить тексты на страницах
Замените статичные тексты на:
```html
<!-- Было: -->
<h1>Мой профиль</h1>

<!-- Стало: -->
<h1 data-i18n="my_profile">Мой профиль</h1>
```

### 3. Подключить translations.js на всех страницах
Добавьте в `<head>` каждой страницы:
```html
<script src="translations.js"></script>
```

### 4. Синхронизация языка с ботом
Когда пользователь приходит из бота, можно передать язык через URL:
```javascript
// В боте при открытии WebApp:
const url = `${WEB_APP_URL}?lang=${lang}`;

// На фронтенде:
const urlParams = new URLSearchParams(window.location.search);
const langFromBot = urlParams.get('lang');
if (langFromBot) {
  setUserLanguage(langFromBot);
}
```

## Текущий статус:

✅ Бот - выбор языка работает
✅ Файлы переводов созданы
✅ Система переводов на фронтенде готова
⏳ Нужно добавить переключатель на страницы
⏳ Нужно обновить тексты на data-i18n атрибуты
⏳ Админка остается на русском (как требовалось)

## Примеры использования:

### Profile page:
```html
<h2 data-i18n="my_rentals">Мои аренды</h2>
<button data-i18n="add_funds">Пополнить</button>
<span data-i18n="balance">Баланс</span>
```

### Map page:
```html
<h2 data-i18n="available_bikes">Доступные велосипеды</h2>
<button data-i18n="rent_now">Арендовать</button>
<span data-i18n="battery_level">Уровень заряда</span>
```

Все готово для использования! Нужно только добавить переключатель и обновить тексты на страницах.
