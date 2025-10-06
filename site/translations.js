// Translations for SteelBike App
const translations = {
  ru: {
    // Navigation
    home: 'Главная',
    map: 'Карта',
    profile: 'Профиль',
    admin: 'Админ',
    
    // Home page
    welcome: 'Добро пожаловать в SteelBike',
    rent_bike: 'Арендовать велосипед',
    how_it_works: 'Как это работает',
    not_registered: 'Вы не зарегистрированы',
    register_via_bot: 'Для использования сервиса необходимо зарегистрироваться через Telegram бота',
    open_bot: 'Открыть бота',
    authorization: 'Авторизация...',
    auth_error: 'Ошибка авторизации',
    
    // Map page
    available_bikes: 'Доступные велосипеды',
    battery_level: 'Уровень заряда',
    distance: 'Расстояние',
    rent_now: 'Арендовать',
    select_point: 'Выберите точку на карте',
    available: 'Свободно',
    build_route: 'Проложить маршрут',
    
    // Profile page
    my_profile: 'Мой профиль',
    my_rentals: 'Мои аренды',
    active_rental: 'Активная аренда',
    rental_history: 'История аренд',
    balance: 'Баланс',
    add_funds: 'Пополнить',
    verification_status: 'Статус верификации',
    pending: 'На проверке',
    verified: 'Подтверждено',
    rejected: 'Отклонено',
    
    // Rental
    start_time: 'Время начала',
    end_time: 'Время окончания',
    duration: 'Длительность',
    cost: 'Стоимость',
    bike_number: 'Номер велосипеда',
    view_contract: 'Посмотреть договор',
    end_rental: 'Завершить аренду',
    
    // Buttons
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    back: 'Назад',
    next: 'Далее',
    
    // Messages
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    no_data: 'Нет данных',
    
    // Errors
    error_loading_data: 'Ошибка загрузки данных',
    error_saving: 'Ошибка сохранения',
    please_try_again: 'Пожалуйста, попробуйте снова',
    
    // Payment
    payment: 'Оплата',
    pay: 'Оплатить',
    payment_method: 'Способ оплаты',
    card: 'Карта',
    
    // Support
    support: 'Поддержка',
    contact_support: 'Связаться с поддержкой',
    faq: 'Частые вопросы'
  },
  
  en: {
    // Navigation
    home: 'Home',
    map: 'Map',
    profile: 'Profile',
    admin: 'Admin',
    
    // Home page
    welcome: 'Welcome to SteelBike',
    rent_bike: 'Rent a bike',
    how_it_works: 'How it works',
    not_registered: 'You are not registered',
    register_via_bot: 'To use the service, you need to register via Telegram bot',
    open_bot: 'Open Bot',
    authorization: 'Authorization...',
    auth_error: 'Authorization Error',
    
    // Map page
    available_bikes: 'Available bikes',
    battery_level: 'Battery level',
    distance: 'Distance',
    rent_now: 'Rent now',
    select_point: 'Select a point on the map',
    available: 'Available',
    build_route: 'Build Route',
    
    // Profile page
    my_profile: 'My Profile',
    my_rentals: 'My Rentals',
    active_rental: 'Active Rental',
    rental_history: 'Rental History',
    balance: 'Balance',
    add_funds: 'Add Funds',
    verification_status: 'Verification Status',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    
    // Rental
    start_time: 'Start Time',
    end_time: 'End Time',
    duration: 'Duration',
    cost: 'Cost',
    bike_number: 'Bike Number',
    view_contract: 'View Contract',
    end_rental: 'End Rental',
    
    // Buttons
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    
    // Messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    no_data: 'No data',
    
    // Errors
    error_loading_data: 'Error loading data',
    error_saving: 'Error saving',
    please_try_again: 'Please try again',
    
    // Payment
    payment: 'Payment',
    pay: 'Pay',
    payment_method: 'Payment Method',
    card: 'Card',
    
    // Support
    support: 'Support',
    contact_support: 'Contact Support',
    faq: 'FAQ'
  }
};

// Helper function to get translation
function t(key, lang = 'en') {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return value || key;
}

// Get user language from localStorage or default to Russian
function getUserLanguage() {
  return localStorage.getItem('userLanguage') || 'ru';
}

// Set user language
function setUserLanguage(lang) {
  localStorage.setItem('userLanguage', lang);
  updatePageLanguage();
}

// Update all elements with data-i18n attribute
function updatePageLanguage() {
  const lang = getUserLanguage();
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key, lang);
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key, lang);
  });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем язык из URL (если пришли из бота)
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  if (langFromUrl && (langFromUrl === 'ru' || langFromUrl === 'en')) {
    setUserLanguage(langFromUrl);
  }
  updatePageLanguage();
});
