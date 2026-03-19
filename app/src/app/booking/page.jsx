'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import RadioButton from '@/components/RadioButton';
import Checkbox from '@/components/Checkbox';
import PackageCard from '@/components/PackageCard';
import ServiceItem from '@/components/ServiceItem';
import NavigationButtons from '@/components/NavigationButtons';
import TextField from '@/components/TextField';

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    //step 1
    complience: false,
    phone: '',
    name: '',
    surname: '',
    vin: '',
    isTO: true,
    isDiagnostic: false,
    //step 2 TO
    TOPackages: [],
    additionalServices: [],
    //step 2 Diagnostic
    diagnosticType: '',
    symptoms: [],
    //step 3 total price
    totalPrice: '',
  });

  // Прокрутка только при смене шага
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  let updateField = (field, value) => {
    console.log('Updating field:', field, 'to value:', value);
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log('Updated formData:', { ...formData, [field]: value });
  };

  // Данные для пакетов ТО
  const toPackages = [
    {
      id: 'package1000',
      title: 'Пакет 10000 км',
      description: 'Стандартное ТО: замена масла и фильтров, диагностика подвески.',
      price: '6500р'
    },
    {
      id: 'package30000',
      title: 'Пакет 30000 км',
      description: 'Расширенное ТО: замена масла/фильтров, свечей, тормозной жидкости, диагностика.',
      price: '12000р'
    }
  ];

  // Дополнительные услуги
  const additionalServices = [
    { id: 'brake_pads', label: 'Замена колодок', price: '3000р' },
    { id: 'brake_discs', label: 'Замена тормозных дисков', price: '10000р' },
  ];

  // Симптомы для диагностики
  const symptoms = [
    { id: 'knocking', label: 'Стуки' },
    { id: 'clicking', label: 'Щелчки' },
    { id: 'vibration', label: 'Вибрация' },
    { id: 'fuel_consumption', label: 'Повышенный расход топлива' },
    { id: 'power_loss', label: 'Потеря мощности' },
  ];

  const diagnosticType = [
    { id: 'mechanical', label: 'Механическая' },
    { id: 'electrical', label: 'Электрическая' },
  ];

  // ================================
  // ШАГ 1: Создание заявки (ИСПРАВЛЕН)
  // ================================
  const Step1 = () => {
    const [localData, setLocalData] = useState({
      phone: formData.phone,
      name: formData.name,
      surname: formData.surname,
      vin: formData.vin,
      isTO: formData.isTO || false,
      isDiagnostic: formData.isDiagnostic || false,
      complience: formData.complience,
    });
    const [error, setError] = useState('');

    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
      // Очищаем ошибку при изменении
      if (field === 'isTO' || field === 'isDiagnostic') {
        setError('');
      }
    };

    const handleNext = () => {
      // Валидация: должен быть выбран хотя бы один вариант
      if (!localData.isTO && !localData.isDiagnostic) {
        setError('Выберите ТО или Диагностику');
        return;
      }

      // НОВАЯ ПРОВЕРКА: галочка политики
      if (!localData.complience) {
        setError('Необходимо согласие с политикой конфиденциальности');
        return;
      }

        // НОВЫЕ ПРОВЕРКИ:
  
      // Телефон: минимум 11 цифр
      const phoneDigits = localData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        setError('Введите корректный номер телефона (минимум 11 цифр)');
        return;
      }
      
      // Имя: минимум 2 буквы, только буквы
      if (!localData.name || localData.name.trim().length < 2 || !/^[а-яА-Яa-zA-Z\s-]+$/.test(localData.name)) {
        setError('Введите корректное имя (минимум 2 буквы)');
        return;
      }
      
      // Фамилия: минимум 2 буквы, только буквы
      if (!localData.surname || localData.surname.trim().length < 2 || !/^[а-яА-Яa-zA-Z\s-]+$/.test(localData.surname)) {
        setError('Введите корректную фамилию (минимум 2 буквы)');
        return;
      }
      
      // VIN: ровно 17 символов, только буквы и цифры (без O, Q, I)
      if (!localData.vin || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(localData.vin)) {
        setError('VIN должен содержать ровно 17 символов (буквы и цифры, без O, Q, I)');
        return;
      }
      
      // Если все проверки пройдены — идём дальше
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });

      // Сохраняем данные
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });

      // Переход на следующий шаг
      if (localData.isTO && !localData.isDiagnostic) {
        setStep(2); // Только ТО
      } else if (!localData.isTO && localData.isDiagnostic) {
        setStep(3); // Только диагностика
      } else {
        setStep(2); // И ТО, и диагностика (сначала ТО)
      }
    };

    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-blue">Создание заявки</h2>
          <button type="button" onClick={() => router.push('/')} className="text-gray-400 text-2xl font-light">
            ×
          </button>
        </div>

        {/* Индикатор прогресса */}
        <div className="mb-6 flex gap-1">
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
        </div>

        <div className="mt-6">
          <h3 className="font-normal mb-4 text-gray text-base">Контактные данные</h3>
          
          <TextField
            type="tel"
            label="Номер телефона"
            value={localData.phone}
            onChange={(e) => updateLocal('phone', e.target.value)}
          />
          
          <TextField
            type="text"
            label="Имя"
            value={localData.name}
            onChange={(e) => updateLocal('name', e.target.value)}
          />
          
          <TextField
            type="text"
            label="Фамилия"
            value={localData.surname}
            onChange={(e) => updateLocal('surname', e.target.value)}
          />
          
          <TextField
            type="text"
            label="VIN номер машины"
            value={localData.vin}
            onChange={(e) => updateLocal('vin', e.target.value)}
          />

          <h3 className="font-normal mb-3 mt-6 text-gray text-base">Цель обращения:</h3>
          
          <div className="border border-gray-200 rounded-xl shadow-md/5">
            <Checkbox
              label="Техническое обслуживание (ТО)"
              checked={localData.isTO}
              onChange={(checked) => updateLocal('isTO', checked)}
            />
            <Checkbox
              label="Диагностика"
              checked={localData.isDiagnostic}
              onChange={(checked) => updateLocal('isDiagnostic', checked)}
            />
          </div>

          {/* ОШИБКА: отображаем под чекбоксами */}
          {error && (
            <div className="text-red-500 mt-2 text-sm">
              {error}
            </div>
          )}

          <NavigationButtons
            onNext={handleNext}
            nextLabel="Следующий шаг"
            showBack={false}
          />
        </div>

        <Checkbox
          label="Я согласен с Политикой в отношении обработки персональных данных"
          checked={localData.complience}
          onChange={(checked) => updateLocal('complience', checked)}
        />
      </div>
    );
  };

  // ================================
  // ШАГ 2: Работы по ТО (ИСПРАВЛЕН)
  // ================================
  const Step2TO = () => {
    const [localData, setLocalData] = useState({
      engineType: formData.engineType,
      TOPackages: [...formData.TOPackages],
      additionalServices: [...formData.additionalServices],
    });
    const [error, setError] = useState('');

    // обновление локального стейта
    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
      // Очищаем ошибку при изменении пакетов ТО
      if (field === 'TOPackages') {
        setError('');
      }
    };

    const handleNext = () => {
      // Валидация: должен быть выбран хотя бы один пакет ТО
      if (localData.TOPackages.length === 0) {
        setError('Выберите пакет ТО');
        return;
      }

      // Сохраняем данные
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });

      // Переход на следующий шаг
      if (formData.isDiagnostic) {
        setStep(3); // Если выбрана и диагностика, идём на неё
        return;
      }
      setStep(4); // Иначе на итоги
    };

    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-blue">
            Работы по ТО
          </h2>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-gray-400 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Индикатор прогресса */}
        <div className="mb-6 flex gap-1">
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
        </div>

        {/* Пакет ТО */}
        <h3 className="font-normal mb-3 mt-6 text-gray text-base">Пакет ТО</h3>
        
        <div className="border border-gray-200 rounded-xl shadow-md/5 p-4">
          {toPackages.map(pkg => (
            <PackageCard
              key={pkg.id}
              label={pkg.title}
              description={pkg.description}
              price={pkg.price}
              checked={localData.TOPackages.includes(pkg.id)}
              onChange={(checked) => {
                const packages = checked
                  ? [...localData.TOPackages, pkg.id]
                  : localData.TOPackages.filter(p => p !== pkg.id);
                updateLocal('TOPackages', packages);
              }}
            />
          ))}
        </div>

        {/* ОШИБКА: отображаем под пакетами ТО */}
        {error && (
          <div className="text-red-500 mt-2 text-sm">
            {error}
          </div>
        )}

        {/* Дополнительные работы */}
        <h3 className="font-normal mb-3 mt-6 text-gray text-base">Дополнительные работы</h3>
        
        <div className="border border-gray-200 rounded-xl shadow-md/5 p-1">
          {additionalServices.map(service => (
            <ServiceItem
              key={service.id}
              label={service.label}
              price={service.price}
              checked={localData.additionalServices.includes(service.id)}
              onChange={(checked) => {
                const services = checked
                  ? [...localData.additionalServices, service.id]
                  : localData.additionalServices.filter(s => s !== service.id);
                updateLocal('additionalServices', services);
              }}
            />
          ))}
        </div>

        {/* Навигация */}
        <NavigationButtons
          onBack={() => setStep(1)}
          onNext={handleNext}
          nextLabel="Следующий шаг"
        />
      </div>
    );
  };

  // ================================
  // ШАГ 2: Работы по Диагностике (ИСПРАВЛЕН)
  // ================================
  const Step2Diagnostic = () => {
    const [localData, setLocalData] = useState({
      diagnosticType: formData.diagnosticType,
      symptoms: formData.symptoms,
    });
    const [errors, setErrors] = useState({
      type: '',
      symptoms: ''
    });

    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
      // Очищаем соответствующую ошибку
      if (field === 'diagnosticType') {
        setErrors(prev => ({ ...prev, type: '' }));
      }
      if (field === 'symptoms') {
        setErrors(prev => ({ ...prev, symptoms: '' }));
      }
    };

    const handleNext = () => {
      const newErrors = { type: '', symptoms: '' };
      let hasError = false;

      // Проверка вида диагностики
      if (!localData.diagnosticType) {
        newErrors.type = 'Выберите вид диагностики';
        hasError = true;
      }

      // Проверка симптомов
      if (localData.symptoms.length === 0) {
        newErrors.symptoms = 'Выберите хотя бы один симптом';
        hasError = true;
      }

      if (hasError) {
        setErrors(newErrors);
        return;
      }

      // Сохраняем данные
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });

      setStep(4); // На итоги
    };

    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-blue">
            Работы по Диагностике
          </h2>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-gray-400 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Индикатор прогресса */}
        <div className="mb-6 flex gap-1">
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 bg-gray-200 rounded"></div>
        </div>

        {/* Вид диагностики */}
        <h3 className="font-normal mb-4 text-gray text-base">
          Вид диагностики
        </h3>
        
        <div className="border border-gray-200 rounded-xl shadow-md/5">
          {diagnosticType.map(type => (
            <RadioButton
              key={type.id}
              label={type.label}
              checked={localData.diagnosticType === type.id}
              onChange={() => updateLocal('diagnosticType', type.id)}
              name="diagnosticType"
            />
          ))}
        </div>

        {/* ОШИБКА: вид диагностики */}
        {errors.type && (
          <div className="text-red-500 mt-2 text-sm">
            {errors.type}
          </div>
        )}

        {/* Симптомы */}
        <h3 className="font-normal mb-2 mt-6 text-gray text-base">
          Симптомы
        </h3>
        
        <div className="border border-gray-200 rounded-xl shadow-md/5">
          {symptoms.map(symptom => (
            <Checkbox
              key={symptom.id}
              label={symptom.label}
              checked={localData.symptoms.includes(symptom.id)}
              onChange={(checked) => {
                const symptomsArr = checked
                  ? [...localData.symptoms, symptom.id]
                  : localData.symptoms.filter(s => s !== symptom.id);
                updateLocal('symptoms', symptomsArr);
              }}
            />
          ))}
        </div>

        {/* ОШИБКА: симптомы */}
        {errors.symptoms && (
          <div className="text-red-500 mt-2 text-sm">
            {errors.symptoms}
          </div>
        )}

        <NavigationButtons
          onBack={() => {
            if (formData.isTO) {
              setStep(2);
            }
            else {
              setStep(1);
            }
          }}
          onNext={handleNext}
          nextLabel="Следующий шаг"
        />
      </div>
    );
  };

  // ================================
  // ШАГ 3: Итоги (ИСПРАВЛЕН)
  // ================================
  const Step3 = () => {
    const [error, setError] = useState('');

    // Рассчитываем выбранные пакеты ТО
    const selectedTOPackages = formData.TOPackages
      .map(id => toPackages.find(p => p.id === id))
      .filter(Boolean);

    // Рассчитываем выбранные дополнительные услуги
    const selectedAdditionalServices = formData.additionalServices
      .map(id => additionalServices.find(s => s.id === id))
      .filter(Boolean);

    // Рассчитываем симптомы диагностики
    const selectedSymptoms = formData.symptoms
      .map(id => symptoms.find(s => s.id === id))
      .filter(Boolean);

    // Итоговая стоимость
    const totalPrice = [
      ...selectedTOPackages.map(p => parseInt(p.price.replace(/\D/g, ''))),
      ...selectedAdditionalServices.map(s => parseInt(s.price.replace(/\D/g, '')))
    ].reduce((sum, price) => sum + price, 0);

    const handleConfirm = () => {
      // Финальная проверка перед отправкой
      const hasTO = formData.TOPackages.length > 0;
      const hasDiagnostic = formData.diagnosticType && formData.symptoms.length > 0;

      if (!hasTO && !hasDiagnostic) {
        setError('Не выбрано ни ТО, ни диагностика');
        return;
      }

      updateField('totalPrice', `От ${totalPrice}р`);
      setStep(5);
    };

    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-blue">Итоги</h2>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-gray-400 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Индикатор прогресса */}
        <div className="mb-6 flex gap-1">
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 rounded bg-blue"></div>
          <div className="h-1 flex-1 rounded bg-blue"></div>
        </div>

        {/* Пакеты ТО */}
        {selectedTOPackages.length > 0 && (
          <div className="border border-gray-200 rounded-xl shadow-md/5 p-4 mb-4">
            <h4 className="text-sm font-light mb-3 text-gray-500">Выбранные пакеты</h4>
            {selectedTOPackages.map(pkg => (
              <div key={pkg.id} className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-normal mb-1 text-gray">{pkg.title}</div>
                  <div className="text-xs font-light text-gray-500">{pkg.description}</div>
                </div>
                <div className="font-normal ml-4 text-gray">{pkg.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* Дополнительные работы */}
        {selectedAdditionalServices.length > 0 && (
          <div className="border border-gray-200 rounded-xl shadow-md/5 rounded p-4 mb-4">
            <h4 className="text-sm font-light mb-3 text-gray-500">Дополнительные работы</h4>
            {selectedAdditionalServices.map(service => (
              <div key={service.id} className="flex justify-between items-center mb-2">
                <div className="font-normal text-gray">{service.label}</div>
                <div className="font-normal text-gray">{service.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* Диагностика */}
        {formData.isDiagnostic && (
          <div className="border border-gray-200 rounded-xl shadow-md/5 rounded-xl shadow-md/5 rounded p-4 mb-4">
            <h4 className="text-sm font-light mb-3 text-gray-500">Симптомы диагностики</h4>
            {selectedSymptoms.length > 0 ? (
              selectedSymptoms.map(symp => (
                <div key={symp.id} className="text-gray font-light mb-1">{symp.label}</div>
              ))
            ) : (
              <div className="text-gray font-light">Нет выбранных симптомов</div>
            )}
          </div>
        )}

        {/* ОШИБКА: финальная проверка */}
        {error && (
          <div className="text-red-500 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Итоговая стоимость */}
        <div className="border border-gray-200 rounded-xl shadow-md/5 p-4 mb-6">
          <div className="flex justify-between items-center text-lg">
            <div className="font-normal text-gray">Итоговая стоимость</div>
            <div className="font-bold text-blue">От {totalPrice}р</div>
          </div>
        </div>

        <NavigationButtons
          onBack={() => setStep(formData.isDiagnostic ? 3 : 2)}
          onNext={handleConfirm}
          nextLabel="Подтвердить"
        />
      </div>
    );
  };

  // ================================
  // ШАГ 4: Заявка создана (исправленная версия)
  // ================================
  const Step4 = () => {
    const randomNumber = useMemo(() => Math.floor(Math.random() * 100) + 1, []);
    
    useEffect(() => {
      fetch('/api/saveBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookingNumber: randomNumber }),
      }).then(() => console.log('Заявка сохранена'));
    }, [formData, randomNumber]);
    
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-blue">
            Заявка создана
          </h2>
        </div>

        <div className="text-center py-8">
          <h3 className="font-normal mb-4 text-gray text-base">
            Приблизительная стоимость работ
          </h3>

          {/* Детали заявки */}
          <div className="rounded p-4 mb-3 text-left border border-gray-200 rounded-xl shadow-md/5">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <div className="text-sm font-light text-gray-500">Номер заявки</div>
              <div className="font-normal text-gray">{randomNumber}</div>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <div className="text-sm font-light text-gray-500">Контактный номер</div>
              <div className="font-light text-gray">{formData.phone}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm font-light text-gray-500">Итоговый диапазон</div>
              <div className="font-normal text-blue">{formData.totalPrice}</div>
            </div>
          </div>

          {/* Кнопка возврата на главную */}
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-blue text-white rounded-full transition-all mt-6 font-normal"
          >
            На главную
          </button>
        </div>
      </div>
    );
  };

  // ================================
  // ОСНОВНОЙ РЕНДЕР
  // ================================
  return (
    <div className="flex-1 flex flex-col w-full py-8 px-4">
      {step === 1 && <Step1 />}
      {step === 2 && <Step2TO />}
      {step === 3 && <Step2Diagnostic />}
      {step === 4 && <Step3 />}
      {step === 5 && <Step4 />}
    </div>
  );
};
