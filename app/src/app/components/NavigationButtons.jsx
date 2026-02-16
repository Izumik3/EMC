export default function ({ onBack, onNext, nextLabel = "Следующий шаг", showBack = true }) {
  return (
    <div className="flex gap-3 mt-6">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className=" text-[15px] flex-1 px-6 py-2 border-2 border-gray-200 background-gray  rounded-[10px] transition-all font-light text-gray"
        >
          ← Назад
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="text-[15px] flex-1 px-6 py-2  bg-blue text-white rounded-[10px]  transition-all flex items-center justify-center font-normal"
      >
        {nextLabel} →
      </button>
    </div>
  );
}
