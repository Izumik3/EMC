import React, { useState } from "react";
export default function TextField({ label, value = "", onChange, type = "text" }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full mb-3">
      <div className="border border-gray-200 rounded-xl  shadow-md/5">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded text-base focus:outline-none focus:border-gray-300"
        />
        </div>
      <label
        className={`absolute left-3 transition-all duration-200
          ${isFocused || value ? "top-0 text-xs text-gray-500" : "top-5 text-gray-400 text-base"}
          pointer-events-none
        `}
      >
        {label}
      </label>
    </div>
  );
}