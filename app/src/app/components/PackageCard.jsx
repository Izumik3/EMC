export default function PackageCard({ label, description, price, checked, onChange }) {
  return (
    <label className="block cursor-pointer mb-3">
     <div className="p-1 rounded ">
        <div className="flex items-center gap-3">
          {/* Кастомный чекбокс */}
          <div className="relative mt-1 flex-shrink-0 w-5 h-5">
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

          {/* Содержание карточки */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-normal text-gray">{label}</h4>
              <span className="font-normal ml-4 text-gray">{price}</span>
            </div>
            <p className="text-sm font-light text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </label>
  );
}