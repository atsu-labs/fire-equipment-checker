import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helpText, className, id, checked, ...props }, ref) => {
    const uniqueId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={uniqueId}
            ref={ref}
            checked={checked ?? false}
            className={`
              h-4 w-4 rounded border-gray-300 text-blue-600 
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500' : ''}
              ${className || ''}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${uniqueId}-error` : helpText ? `${uniqueId}-help` : undefined
            }
            {...props}
          />
          <label htmlFor={uniqueId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        </div>

        {helpText && !error && (
          <p id={`${uniqueId}-help`} className="text-xs text-gray-500 ml-6">
            {helpText}
          </p>
        )}

        {error && (
          <p id={`${uniqueId}-error`} className="text-xs text-red-600 ml-6">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
