import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { groupUsageTypes } from '@/lib/regulations/utils/usage-groups';
import { USAGE_TYPES } from '@/lib/regulations/data/usage-types';

export interface UsageCodeSelectProps {
  name?: string;
  onChange?: (value: string) => void;
  value?: string | undefined;
  control?: Control<any> | undefined;
}

function RenderSelect({ name = 'usageCode', value, onChange }: Partial<UsageCodeSelectProps>) {
  const groups = groupUsageTypes(USAGE_TYPES as any);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        用途コード
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        aria-label="用途コード"
      >
        <option value="">選択してください</option>
        {Object.entries(groups).map(([category, options]) => (
          <optgroup key={category} label={category}>
            {options.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default function UsageCodeSelect({ name = 'usageCode', onChange, value, control }: UsageCodeSelectProps) {
  // If control provided, use Controller internally to bind to RHF
  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RenderSelect name={name} value={field.value} onChange={field.onChange} />
        )}
      />
    );
  }

  return <RenderSelect name={name} value={value} onChange={onChange} />;
}
