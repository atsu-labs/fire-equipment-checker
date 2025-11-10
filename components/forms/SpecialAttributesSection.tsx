'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import type { BuildingInfoFormExtendedInput } from '@/lib/regulations/utils/schemas';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';

interface SpecialAttributesSectionProps {
  control: Control<BuildingInfoFormExtendedInput>;
  errors: FieldErrors<BuildingInfoFormExtendedInput>;
  floors: number;
}

/**
 * 特殊属性入力セクションコンポーネント
 * 
 * 責務:
 * - 無窓階、避難階、直通階段数等の特殊属性の入力UI提供
 * - 階数に応じた条件付きレンダリング
 */
export function SpecialAttributesSection({
  control,
  errors,
  floors,
}: SpecialAttributesSectionProps) {
  return (
    <div className="space-y-4">
      {/* 無窓階 */}
      <Controller
        name="isWindowless"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            label="無窓階"
            helpText="すべての出入口が屋内に面している階"
            checked={field.value as boolean}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

      {/* 避難階 */}
      <Controller
        name="isEvacuationFloor"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            label="避難階"
            helpText="直接地上へ通じる出口を有する階"
            checked={field.value as boolean}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

      {/* 避難上有効な屋外階段 */}
      <Controller
        name="hasEffectiveOutdoorStair"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            label="避難上有効な屋外階段あり"
            helpText="総務省令で定める避難上有効な構造の屋外階段"
            checked={field.value as boolean}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

      {/* 防火壁区画 */}
      <Controller
        name="hasFirewallSeparation"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            label="防火壁区画あり"
            helpText="避難上有効な開口部を有しない壁で区画"
            checked={field.value as boolean}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

      {/* 直通階段数（階数が3階以上の場合のみ表示） */}
      {floors >= 3 && (
        <Controller
          name="directStairCount"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                type="number"
                label="直通階段数"
                unit="本"
                placeholder="0"
                helpText="避難階又は地上に直通する階段の数"
                error={errors.directStairCount?.message}
                {...field}
                value={field.value || ''}
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
