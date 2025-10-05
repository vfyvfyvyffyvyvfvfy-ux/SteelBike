@echo off
echo 🤖 Настройка Telegram бота для PRIZMATIC
echo =========================================

REM Проверка наличия Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен. Установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js найден:
node --version

REM Проверка наличия npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm не найден. Установите npm.
    pause
    exit /b 1
)

echo ✅ npm найден:
npm --version

REM Установка зависимостей
echo.
echo 📦 Установка зависимостей...
npm install

if %errorlevel% equ 0 (
    echo ✅ Зависимости установлены успешно
) else (
    echo ❌ Ошибка при установке зависимостей
    echo.
    echo Нажмите любую клавишу для выхода...
    pause >nul
    exit /b 1
)

REM Проверка наличия видео файла
if not exist "IMG_7164.MP4" (
    echo.
    echo ⚠️  Видео файл IMG_7164.MP4 не найден!
    echo    Поместите файл IMG_7164.MP4 в корневую папку проекта
    echo.
    echo ❓ Продолжить без видео файла? (бот будет работать, но без видео)
    echo.
    pause
)

echo.
echo 🚀 Запуск бота...
echo Для остановки нажмите Ctrl+C
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при запуске бота!
    echo Проверьте:
    echo - Правильность токена бота
    echo - Наличие файла IMG_7164.MP4
    echo - Доступ к интернету
    echo.
)

echo.
echo 🛑 Бот остановлен
echo Нажмите любую клавишу для выхода...
pause >nul