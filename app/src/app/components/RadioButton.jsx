export default function RadioButton({ label, checked, onChange, name }) {
  return (
    <label className="flex items-center justify-between p-2 mb-1 cursor-pointer  last:border-0">
      <span className=" font-light text-gray">
        {label}
      </span>
      <div className="relative mt-1 flex items-center">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-6 h-6 appearance-none border-2 border-gray-300 rounded-full checked:border-blue"
        />
        {checked && (
          <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue"></div>
        )}
      </div>
    </label>
  );
}