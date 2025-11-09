import React, { forwardRef } from 'react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export interface SelectOptionGroup<T = string> {
  label: string;
  options: SelectOption<T>[];
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, groups, error, placeholder = '選択してください', className, id, name, ...props }, ref) => {
    // Generate unique ID for accessibility
    const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const selectClasses = `
      w-full rounded-md border px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? 'border-red-500' : 'border-gray-300'}
      ${className || ''}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className="space-y-1">
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          ref={ref}
          className={selectClasses}
          id={selectId}
          name={name}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {/* Placeholder option */}
          <option value="" disabled>
            {placeholder}
          </option>

          {/* Simple options */}
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

          {/* Grouped options */}
          {groups && groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
