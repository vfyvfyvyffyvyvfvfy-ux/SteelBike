#!/bin/bash

echo "🤖 Настройка Telegram бота для PRIZMATIC"
echo "========================================"

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js с https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm."
    exit 1
fi

echo "✅ npm найден: $(npm --version)"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Зависимости установлены успешно"
else
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

# Проверка наличия видео файла
if [ ! -f "IMG_7164.MP4" ]; then
    echo ""
    echo "⚠️  Видео файл IMG_7164.MP4 не найден!"
    echo "   Поместите файл IMG_7164.MP4 в корневую папку проекта"
    echo ""
fi

echo ""
echo "🚀 Запуск бота..."
echo "Для остановки нажмите Ctrl+C"
echo ""

npm start