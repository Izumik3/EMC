'use client';

import { useState, useRef, useEffect } from 'react';
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
  // ШАГ 1: Создание заявки (обновлённый)
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

    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });
      if (localData.isDiagnostic && !localData.isTO) {
        setStep(3);
        return;
      }
      setStep(2);
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
          <div className="border border-gray-200 rounded-xl  shadow-md/5">
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

          <p className="text-xs font-light mt-6 text-gray-500">

          </p>


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
  // ШАГ 2: Работы по ТО
  // ================================
  const Step2TO = () => {
    const [localData, setLocalData] = useState({
      engineType: formData.engineType,
      TOPackages: [...formData.TOPackages],
      additionalServices: [...formData.additionalServices],
    });

    // обновление локального стейта
    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });
      if (formData.isDiagnostic) {
        setStep(3);
        return;
      }
      setStep(4);
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


        <h3 className="font-normal mb-3 mt-6 text-gray text-base">Пакет ТО </h3>
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

        {/* Дополнительные работы */}
        <h3 className="font-normal mb-3 mt-6 text-gray text-base">Дополнительные работы</h3>
        <div className="border border-gray-200 rounded-xl  shadow-md/5 p-1">
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
  // ШАГ 2: Работы по Диагностике
  // ================================
  const Step2Diagnostic = () => {
    const [localData, setLocalData] = useState({
      diagnosticType: formData.diagnosticType,
      symptoms: formData.symptoms,
    });

    const updateLocal = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
      Object.entries(localData).forEach(([field, value]) => {
        updateField(field, value);
      });
      setStep(4);
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
        <div className="border border-gray-200 rounded-xl  shadow-md/5">
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

        {/* Симптомы */}
        <h3 className="font-normal mb-2 mt-6 text-gray text-base">
          Симптомы
        </h3>
        <div className="border border-gray-200 rounded-xl  shadow-md/5">
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
  // ШАГ 3: Итоги
  // ================================
  const Step3 = () => {
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
          <div className="border border-gray-200 rounded-xl  shadow-md/5 p-4 mb-4">
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
          <div className="border border-gray-200 rounded-xl  shadow-md/5 rounded p-4 mb-4">
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
          <div className="border border-gray-200 rounded-xl  shadow-md/5 rounded-xl  shadow-md/5 rounded p-4 mb-4">
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

        {/* Итоговая стоимость */}
        <div className="border border-gray-200 rounded-xl  shadow-md/5 p-4 mb-6 ">
          <div className="flex justify-between items-center text-lg">
            <div className="font-normal text-gray">Итоговая стоимость</div>
            <div className="font-bold text-blue">От {totalPrice}р</div>
          </div>
        </div>



        <NavigationButtons
          onBack={() => setStep(formData.isDiagnostic ? 3 : 2)}
          onNext={() => {
            updateField('totalPrice', `От ${totalPrice}р`);
            setStep(5)
          }}
          nextLabel="Подтвердить"
        />
      </div>
    );
  };
  // ================================
  // ШАГ 4: Заявка создана
  // ================================
  const Step4 = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    useEffect(() => {
      fetch('/api/saveBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookingNumber: randomNumber }),
      }).then(() => console.log('Заявка сохранена'));
    }, [formData]);
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
          <div className="rounded p-4 mb-3 text-left border border-gray-200 rounded-xl  shadow-md/5">
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

