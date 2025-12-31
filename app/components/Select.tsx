"use client";

import React, { SelectHTMLAttributes, ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  children?: ReactNode;
  placeholder?: string; 
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg 
          bg-white text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
          ${className}
        `}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

        {children}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
