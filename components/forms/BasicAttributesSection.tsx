import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

export interface BasicAttributesSectionProps {
  control?: Control<any>;
  errors?: any;
}

export default function BasicAttributesSection({ control, errors }: BasicAttributesSectionProps) {
  // If control provided, bind inputs via Controller, otherwise render uncontrolled inputs
  if (control) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          control={control}
          name="totalArea"
          render={({ field }) => (
            <Input
              label="延床面積"
              type="number"
              unit="㎡"
              helpText="建築物の延べ面積を入力してください"
              value={field.value}
              onChange={field.onChange}
              error={errors?.totalArea?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="floors"
          render={({ field }) => (
            <Input
              label="階数"
              type="number"
              unit="階"
              helpText="地上の階数を入力してください"
              value={field.value}
              onChange={field.onChange}
              error={errors?.floors?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="undergroundFloors"
          render={({ field }) => (
            <Input
              label="地階数"
              type="number"
              unit="階"
              helpText="地階の数を入力してください(0の場合は0を入力)"
              value={field.value}
              onChange={field.onChange}
              error={errors?.undergroundFloors?.message}
            />
          )}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Input
        label="延床面積"
        type="number"
        unit="㎡"
        helpText="建築物の延べ面積を入力してください"
        error={errors?.totalArea?.message}
      />

      <Input
        label="階数"
        type="number"
        unit="階"
        helpText="地上の階数を入力してください"
        error={errors?.floors?.message}
      />

      <Input
        label="地階数"
        type="number"
        unit="階"
        helpText="地階の数を入力してください(0の場合は0を入力)"
        error={errors?.undergroundFloors?.message}
      />
    </div>
  );
}
