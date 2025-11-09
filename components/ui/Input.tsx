import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: 'text' | 'number' | 'email';
  unit?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, unit, error, helpText, className, id, name, ...props }, ref) => {
    // Generate unique ID for accessibility
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputClasses = `
      w-full rounded-md border px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? 'border-red-500' : 'border-gray-300'}
      ${className || ''}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            id={inputId}
            name={name}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {unit}
            </span>
          )}
        </div>
        {helpText && !error && (
          <p className="text-xs text-gray-500">{helpText}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
