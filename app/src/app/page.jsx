import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">

      <section className="text-center flex flex-col items-center w-full py-10">
        <h1 className="text-[24px] font-regular text-blue max-w-[600px] px-4 text-center">
          ОНЛАЙН-ЗАПИСЬ В АВТОЦЕНТР
        </h1>
        <p className="mt-5 mb-8 max-w-[600px] leading-relaxed px-4 text-left font-light text-[16px]">
          Укажите данные вашего автомобиля, и мы сразу рассчитаем стоимость
          и подберем удобное время для записи.
        </p>
    
        {/* Две кнопки рядом */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking">
            <button className="text-[20px] bg-blue text-white text-lg px-8 py-3 rounded-[10px] active:translate-y-px font-regular hover:bg-blueDark transition-colors">
              Записаться
            </button>
          </Link>
          
          <Link href="/feedback">
            <button className="text-[20px] border-2 border-blue text-blue text-lg px-8 py-3 rounded-[10px] active:translate-y-px font-regular hover:bg-blue hover:text-white transition-colors">
              Написать нам
            </button>
          </Link>
        </div>
      </section>

      <section className="text-center flex flex-col items-center w-full">
        <h2 className="text-blue text-[24px] mb-4 px-4 text-center">О НАШЕМ СЕРВИСЕ</h2>
        <p className="max-w-[600px] font-light leading-relaxed px-4 text-left text-[16px]">
          Автоцентр предоставляет широкий спектр услуг обслуживания автомобилей.
          Команда профессионалов проведёт необходимые работы в кратчайшие сроки:
          от технического обслуживания до ремонта отдельных частей автомобиля.
        </p>
      </section>

    </div>
  );
}