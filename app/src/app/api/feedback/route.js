import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу с данными
const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

// Функция для чтения данных из файла
function readFeedbackData() {
  try {
    // Если папки data нет — создаём
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Если файла нет — создаём пустой массив
    if (!fs.existsSync(FEEDBACK_FILE)) {
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла:', error);
    return [];
  }
}

// Функция для записи данных в файл
function writeFeedbackData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Ошибка записи файла:', error);
    return false;
  }
}

// Функция валидации email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Функция валидации телефона (минимум 11 цифр)
function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 11;
}

// Обработчик POST-запроса
export async function POST(request) {
  try {
    // Проверяем метод
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'method', message: 'Метод не поддерживается' },
        { status: 405 }
      );
    }

    // Проверяем размер тела запроса (не больше 1MB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return NextResponse.json(
        { error: 'size', message: 'Размер запроса слишком большой' },
        { status: 413 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();
    const { name, email, phone, message, consent } = body;

    // ВАЛИДАЦИЯ
    // 1. Проверка имени
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'name', message: 'Имя слишком короткое' },
        { status: 400 }
      );
    }

    // 2. Проверка email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'email', message: 'Некорректный email' },
        { status: 400 }
      );
    }

    // 3. Проверка телефона
    if (!phone || typeof phone !== 'string' || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'phone', message: 'Некорректный номер телефона' },
        { status: 400 }
      );
    }

    // 4. Проверка сообщения
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'message', message: 'Сообщение слишком короткое (минимум 10 символов)' },
        { status: 400 }
      );
    }

    // 5. Проверка согласия
    if (consent !== true) {
      return NextResponse.json(
        { error: 'consent', message: 'Необходимо согласие на обработку данных' },
        { status: 400 }
      );
    }

    // Экранирование спецсимволов (защита от XSS)
    const sanitizeString = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };

    // Создаём объект сообщения
    const newFeedback = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      name: sanitizeString(name.trim()),
      email: sanitizeString(email.trim().toLowerCase()),
      phone: sanitizeString(phone.trim()),
      message: sanitizeString(message.trim()),
      consent: true
    };

    // Читаем существующие данные
    const feedbackData = readFeedbackData();
    
    // Добавляем новое сообщение
    feedbackData.push(newFeedback);
    
    // Сохраняем в файл
    const saved = writeFeedbackData(feedbackData);
    
    if (!saved) {
      return NextResponse.json(
        { error: 'server', message: 'Ошибка сохранения данных' },
        { status: 500 }
      );
    }

    // Логирование
    console.log(`[Feedback] Новое сообщение от ${newFeedback.name} (${newFeedback.email}) в ${newFeedback.createdAt}`);

    // Успешный ответ
    return NextResponse.json(
      {
        success: true,
        id: newFeedback.id,
        message: 'Сообщение отправлено'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    return NextResponse.json(
      { error: 'server', message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}