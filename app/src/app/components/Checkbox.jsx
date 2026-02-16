export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center py-3 cursor-pointer last:border-0">
      <div className="p-2 rounded">
      <div className="relative w-5 h-5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div className={`w-full h-full border-2 border-gray-300 rounded-lg 
                         ${checked ? 'bg-blue border-blue' : 'bg-white'} 
                         flex items-center justify-center transition-colors duration-200`}>
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
        </div>
      <span className="ml-3 font-light text-gray">{label}</span>
    </label>
  );
}