'use client';

import React, { useMemo, useState } from 'react';
import { Control, useFieldArray, FieldErrors } from 'react-hook-form';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { USAGE_TYPES } from '@/lib/regulations/data/usage-types';
import type { BuildingInfo, UsageCode, FloorUsageDetail } from '@/lib/regulations/types';

interface FloorUsageTableProps {
  control: Control<BuildingInfo>;
  errors: FieldErrors<BuildingInfo>;
}

interface FloorAttributesState {
  isWindowless?: boolean;
  isEvacuationFloor?: boolean;
  directStairCount?: number;
  hasEffectiveOutdoorStair?: boolean;
  hasFirewallSeparation?: boolean;
}

/**
 * 階別用途詳細入力テーブルコンポーネント
 * 複合用途建築物((16)項)の場合に表示
 * React Hook Form の useFieldArray で動的配列を管理
 */
export function FloorUsageTable({ control, errors }: FloorUsageTableProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'floorUsageDetails',
  });

  // 階全体属性管理の状態
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const [floorAttributes, setFloorAttributes] = useState<Map<number, FloorAttributesState>>(new Map());

  // 用途コードの選択肢を作成（グループ化）
  const usageOptions = useMemo(() => {
    const categories = new Map<string, Array<{ code: UsageCode; name: string }>>();
    
    Object.values(USAGE_TYPES).forEach((usage) => {
      if (!categories.has(usage.category)) {
        categories.set(usage.category, []);
      }
      categories.get(usage.category)?.push({
        code: usage.code,
        name: usage.name,
      });
    });

    return Array.from(categories.entries()).map(([category, options]) => ({
      label: category,
      options: options.map((opt) => ({
        value: opt.code,
        label: `${opt.name}`,
      })),
    }));
  }, []);

  // 用途別床面積合計を計算（パフォーマンス最適化用 useMemo）
  const usageSummary = useMemo(() => {
    const summary = new Map<UsageCode, number>();
    
    fields.forEach((field: any) => {
      const usageCode = field.usageCode as UsageCode;
      const area = field.area as number;
      
      if (usageCode && area) {
        summary.set(usageCode, (summary.get(usageCode) || 0) + area);
      }
    });

    return summary;
  }, [fields]);

  // 指定階の全フィールドを取得
  const getFloorFields = (floor: number) => {
    return fields
      .map((field, index) => ({ ...field, index }))
      .filter((item: any) => item.floor === floor);
  };

  // 全ユニークな階を取得
  const uniqueFloors = useMemo(() => {
    const floors = new Set<number>();
    fields.forEach((field: any) => {
      floors.add(field.floor);
    });
    return Array.from(floors).sort((a, b) => a - b);
  }, [fields]);

  // 階全体属性を更新
  const updateFloorAttributes = (
    floor: number,
    attributes: FloorAttributesState
  ) => {
    // 状態を保存
    setFloorAttributes((prev) => new Map(prev).set(floor, attributes));

    // 同一階の全フィールドに属性を反映
    getFloorFields(floor).forEach((item: any) => {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          control.setValue(`floorUsageDetails.${item.index}.${key}` as any, value);
        }
      });
    });
  };

  const handleAddRow = () => {
    append({
      floor: 1,
      usageCode: '1-i' as UsageCode,
      area: 0,
      capacity: undefined,
      isWindowless: false,
      isEvacuationFloor: false,
    });
  };

  const handleRemoveRow = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          階別用途詳細
        </h3>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleAddRow}
        >
          行を追加
        </Button>
      </div>

      {/* 階別属性管理パネル */}
      {uniqueFloors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">階別属性設定</h4>
          <div className="space-y-2 border border-gray-200 rounded-md bg-gray-50 p-3">
            {uniqueFloors.map((floor) => {
              const isExpanded = expandedFloor === floor;
              const floorData = getFloorFields(floor);
              const attrs = floorAttributes.get(floor) || {};
              
              return (
                <div key={floor} className="border border-gray-200 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedFloor(isExpanded ? null : floor)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900">
                        {floor < 0 ? `地下${Math.abs(floor)}階` : `${floor}階`}
                        <span className="ml-2 text-xs text-gray-500">
                          ({floorData.length}用途)
                        </span>
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 px-3 py-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attrs.isWindowless || false}
                            onChange={(e) =>
                              updateFloorAttributes(floor, {
                                ...attrs,
                                isWindowless: e.target.checked,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">無窓階</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attrs.isEvacuationFloor || false}
                            onChange={(e) =>
                              updateFloorAttributes(floor, {
                                ...attrs,
                                isEvacuationFloor: e.target.checked,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">避難階</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attrs.hasEffectiveOutdoorStair || false}
                            onChange={(e) =>
                              updateFloorAttributes(floor, {
                                ...attrs,
                                hasEffectiveOutdoorStair: e.target.checked,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">屋外階段あり</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attrs.hasFirewallSeparation || false}
                            onChange={(e) =>
                              updateFloorAttributes(floor, {
                                ...attrs,
                                hasFirewallSeparation: e.target.checked,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">防火壁区画あり</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          直通階段数
                        </label>
                        <input
                          type="number"
                          value={attrs.directStairCount || 0}
                          onChange={(e) =>
                            updateFloorAttributes(floor, {
                              ...attrs,
                              directStairCount: e.target.valueAsNumber,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* テーブル */}
      <div className="overflow-x-auto border border-gray-300 rounded-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-16">
                階数
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-32">
                用途コード
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-24">
                床面積(㎡)
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-24">
                収容人員
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-20">
                無窓階
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700 w-20">
                避難階
              </th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700 w-12">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  データがありません。行を追加してください。
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  {/* 階数 */}
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      {...control.register(
                        `floorUsageDetails.${index}.floor`,
                        {
                          valueAsNumber: true,
                          required: '階数は必須です',
                        }
                      )}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="例: -1, 1, 2..."
                    />
                    {errors.floorUsageDetails?.[index]?.floor && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.floorUsageDetails[index].floor?.message}
                      </p>
                    )}
                  </td>

                  {/* 用途コード */}
                  <td className="border border-gray-300 px-3 py-2">
                    <select
                      {...control.register(
                        `floorUsageDetails.${index}.usageCode`,
                        {
                          required: '用途コードは必須です',
                        }
                      )}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">選択してください</option>
                      {usageOptions.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.floorUsageDetails?.[index]?.usageCode && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.floorUsageDetails[index].usageCode?.message}
                      </p>
                    )}
                  </td>

                  {/* 床面積 */}
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      {...control.register(
                        `floorUsageDetails.${index}.area`,
                        {
                          valueAsNumber: true,
                          required: '床面積は必須です',
                          min: 0,
                        }
                      )}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                    {errors.floorUsageDetails?.[index]?.area && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.floorUsageDetails[index].area?.message}
                      </p>
                    )}
                  </td>

                  {/* 収容人員 */}
                  <td className="border border-gray-300 px-3 py-2">
                    <input
                      type="number"
                      {...control.register(
                        `floorUsageDetails.${index}.capacity`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="0"
                    />
                  </td>

                  {/* 無窓階 */}
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      {...control.register(
                        `floorUsageDetails.${index}.isWindowless`
                      )}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* 避難階 */}
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      {...control.register(
                        `floorUsageDetails.${index}.isEvacuationFloor`
                      )}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* 削除ボタン */}
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded text-red-600 hover:bg-red-50"
                      title="この行を削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 用途別床面積合計 */}
      {usageSummary.size > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">用途別床面積合計</h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from(usageSummary.entries()).map(([usageCode, area]) => {
              const usageType = USAGE_TYPES[usageCode];
              return (
                <div
                  key={usageCode}
                  className="border border-gray-200 rounded px-3 py-2 bg-blue-50"
                >
                  <p className="text-xs text-gray-600">{usageType.name}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {area.toFixed(2)} ㎡
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* エラーサマリー */}
      {errors.floorUsageDetails && (
        <div className="rounded-md bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-800">
            階別用途詳細に入力エラーがあります。上のテーブルを確認してください。
          </p>
        </div>
      )}
    </div>
  );
}
