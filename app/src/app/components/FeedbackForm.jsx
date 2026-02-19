'use client';

import { useState } from 'react';
import TextField from './TextField';
import Checkbox from './Checkbox';

export default function FeedbackForm() {
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });

  // Состояние ошибок
  const [errors, setErrors] = useState({});
  
  // Показывать ли ошибки (после попытки отправки или при blur)
  const [showErrors, setShowErrors] = useState(false);
  
  // Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Обновление полей
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Валидация email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Валидация телефона (минимум 11 цифр)
  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 11;
  };

  // Проверка конкретного поля
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) return 'Имя слишком короткое';
        break;
      case 'email':
        if (!value || !isValidEmail(value)) return 'Введите корректный email';
        break;
      case 'phone':
        if (!value || !isValidPhone(value)) return 'Введите корректный номер';
        break;
      case 'message':
        if (!value || value.trim().length < 10) return 'Сообщение слишком короткое';
        break;
      case 'consent':
        if (!value) return 'Необходимо согласие на обработку данных';
        break;
      default:
        return null;
    }
    return null;
  };

  // Валидация всей формы
  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      message: validateField('message', formData.message),
      consent: validateField('consent', formData.consent),
    };

    // Убираем null ошибки
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик blur (когда пользователь уходит из поля)
  const handleBlur = (field) => {
    if (showErrors) {
      const error = validateField(field, formData[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setShowErrors(true);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          consent: formData.consent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', consent: false });
        setShowErrors(false);
      } else {
        setSubmitStatus('error');
        if (data.error) {
          setErrors(prev => ({ ...prev, [data.error]: data.message }));
        }
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-light text-blue mb-6 text-center">
        Написать нам
      </h2>

      {/* Имя */}
      <div className="mb-4">
        <TextField
          type="text"
          label="Ваше имя"
          placeholder="Иван"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          onBlur={() => handleBlur('name')}
        />
        {showErrors && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <TextField
          type="email"
          label="Email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {showErrors && errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Телефон */}
      <div className="mb-4">
        <TextField
          type="tel"
          label="Телефон"
          placeholder="+7 (999) 999-99-99"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
        />
        {showErrors && errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Сообщение */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray">
          Ваше сообщение
        </label>
        <textarea
          rows={4}
          placeholder="Опишите ваш вопрос или предложение..."
          value={formData.message}
          onChange={(e) => updateField('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue ${
            showErrors && errors.message ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {showErrors && errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Согласие */}
      <div className="mb-6">
        <Checkbox
          label="Я согласен с Политикой в отношении обработки персональных данных"
          checked={formData.consent}
          onChange={(checked) => {
            updateField('consent', checked);
            if (showErrors) {
              setErrors(prev => ({ ...prev, consent: validateField('consent', checked) }));
            }
          }}
        />
        {showErrors && errors.consent && (
          <p className="text-red-500 text-sm mt-1">{errors.consent}</p>
        )}
      </div>

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-full font-normal transition-all ${
          submitStatus === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-blue text-white hover:opacity-90'
        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Отправка...' : submitStatus === 'success' ? 'Отправлено!' : 'Отправить'}
      </button>

      {submitStatus === 'success' && (
        <p className="text-green-600 text-center mt-4">Спасибо! Мы свяжемся с вами в ближайшее время</p>
      )}
      
      {submitStatus === 'error' && (
        <p className="text-red-500 text-center mt-4">Что-то пошло не так, попробуйте позже</p>
      )}
    </form>
  );
}