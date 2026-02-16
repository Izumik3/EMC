export default function ServiceItem({ label, price, checked, onChange }) {
  return (
    <label className="block py-3 cursor-pointer last:border-0">
     <div className="p-1 rounded">
        <div className="flex items-center gap-3">
          {/* Кастомный чекбокс */}
          <div className="relative w-5 h-5 flex-shrink-0">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={`w-full h-full border-2 rounded-lg flex items-center justify-center transition-colors duration-200
                ${checked ? 'bg-blue border-blue' : 'bg-white border-gray-300'}`}
            >
              {checked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>

          {/* Название и цена */}
          <div className="flex-1 flex justify-between items-center">
            <span className="font-light text-gray">{label}</span>
            {price && <span className="font-normal text-gray">{price}</span>}
          </div>
        </div>
      </div>
    </label>
  );
}