'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { BuildingInfo, JudgmentResult } from '@/lib/regulations/types';
import { buildingInfoFormSchemaExtended, type BuildingInfoFormExtendedInput } from '@/lib/regulations/utils/schemas';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import UsageCodeSelect from './UsageCodeSelect';
import BasicAttributesSection from './BasicAttributesSection';
import { FloorUsageTable } from './FloorUsageTable';
import SpecialAttributesSection from './SpecialAttributesSection';

export interface BuildingInputFormProps {
  /** 初期データ(復元用) */
  initialData?: Partial<BuildingInfo>;
  /** 送信成功時のコールバック */
  onSubmitSuccess?: (result: JudgmentResult) => void;
  /** 送信エラー時のコールバック */
  onSubmitError?: (error: Error) => void;
}

const STORAGE_KEY = 'building-form-data';
const DEBOUNCE_DELAY = 500;

/**
 * フォームデータをlocalStorageに保存するカスタムフック
 */
function useLocalStorageForm(
  key: string,
  defaultValues: Partial<BuildingInfo>
) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveData = useCallback((data: Partial<BuildingInfo>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save form data to localStorage:', error);
      }
    }, DEBOUNCE_DELAY);
  }, [key]);

  const loadData = useCallback((): Partial<BuildingInfo> | null => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load form data from localStorage:', error);
      return null;
    }
  }, [key]);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear form data from localStorage:', error);
    }
  }, [key]);

  return { saveData, loadData, clearData };
}

/**
 * 建築物情報入力フォームコンポーネント
 * 
 * 責務:
 * - フォーム全体のオーケストレーション
 * - React Hook Form状態管理
 * - バリデーション統合
 * - API送信処理
 * - localStorage自動保存
 */
export function BuildingInputForm({
  initialData,
  onSubmitSuccess,
  onSubmitError,
}: BuildingInputFormProps) {
  const router = useRouter();
  const { saveData, loadData, clearData } = useLocalStorageForm(STORAGE_KEY, {});
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = React.useState(false);

  // React Hook Form初期化
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm<BuildingInfoFormExtendedInput>({
    resolver: zodResolver(buildingInfoFormSchemaExtended),
    mode: 'onBlur',
    defaultValues: async () => {
      // 初期データの優先順位: initialData > localStorage > デフォルト
      const restoredData = loadData();
      return (
        (initialData || restoredData) || {
          usageCode: undefined,
          totalArea: '',
          floors: '',
          undergroundFloors: '',
        }
      ) as any;
    },
  });

  // フォームデータ監視 (auto-save)
  const watchedData = watch();

  useEffect(() => {
    // フォームデータをlocalStorageに自動保存
    if (watchedData.usageCode) {
      const dataToSave: Partial<BuildingInfo> = {
        usageCode: watchedData.usageCode,
        totalArea: watchedData.totalArea ? parseFloat(watchedData.totalArea as string) : undefined,
        floors: watchedData.floors ? parseInt(watchedData.floors as string, 10) : undefined,
        undergroundFloors: watchedData.undergroundFloors ? parseInt(watchedData.undergroundFloors as string, 10) : undefined,
        floorUsageDetails: watchedData.floorUsageDetails,
      };
      saveData(dataToSave);
    }
  }, [watchedData, saveData]);

  // フォーム送信ハンドラー
  const onSubmit: SubmitHandler<BuildingInfoFormExtendedInput> = async (data) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // フォームデータを型安全なBuildingInfo型に変換
      const buildingInfo: BuildingInfo = {
        usageCode: data.usageCode,
        totalArea: typeof data.totalArea === 'string' ? parseFloat(data.totalArea) : data.totalArea,
        floors: typeof data.floors === 'string' ? parseInt(data.floors as string, 10) : data.floors,
        undergroundFloors: typeof data.undergroundFloors === 'string' ? parseInt(data.undergroundFloors as string, 10) : data.undergroundFloors,
        floorUsageDetails: data.floorUsageDetails,
      };

      // API呼び出し
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildingInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API error: ${response.status}`
        );
      }

      const result: JudgmentResult = await response.json();

      // localStorage削除
      clearData();

      // 成功コールバック
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }

      // 結果画面に遷移
      router.push('/result');
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unknown error occurred';

      // ネットワークエラーの場合の特別メッセージ
      if (errorMessage.includes('fetch') || errorMessage.toLowerCase().includes('network')) {
        setSubmitError('通信エラーが発生しました。インターネット接続を確認してください。');
      } else {
        setSubmitError(errorMessage || 'エラーが発生しました。');
      }

      // エラーコールバック
      if (onSubmitError) {
        onSubmitError(error instanceof Error ? error : new Error(errorMessage));
      }

      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // クリア処理
  const handleClear = () => {
    setShowClearDialog(true);
  };

  const handleClearConfirm = () => {
    reset({
      usageCode: undefined,
      totalArea: '',
      floors: '',
      undergroundFloors: '',
    });
    clearData();
    setShowClearDialog(false);
  };

  const handleClearCancel = () => {
    setShowClearDialog(false);
  };

  // 用途コード監視（複合用途判定）
  const usageCode = watch('usageCode');
  const isComplexUsage = usageCode?.startsWith('16');

  // 階数監視（特殊属性条件付きレンダリング）
  const floors = watch('floors');
  const floorsNum = floors ? parseInt(floors as string, 10) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            建築物情報入力
          </h1>
          <p className="text-gray-600">
            消防法施行令に基づく必要設備を自動判別します
          </p>
        </div>

        {/* エラーメッセージ（API エラー用） */}
        {submitError && (
          <div className="mb-6">
            <ErrorMessage message={submitError} icon={true} />
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 用途コード選択セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              用途コード選択
            </h2>
            <UsageCodeSelect control={control} error={errors.usageCode} />
          </div>

          {/* 基本属性入力セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              基本属性
            </h2>
            <BasicAttributesSection control={control} errors={errors} />
          </div>

          {/* 複合用途詳細テーブル（条件付き表示）*/}
          {isComplexUsage && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                階別用途詳細
              </h2>
              <FloorUsageTable control={control} errors={errors} />
            </div>
          )}

          {/* 特殊属性入力セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              特殊属性
            </h2>
            <SpecialAttributesSection
              control={control}
              errors={errors}
              floors={floorsNum}
            />
          </div>

          {/* ボタン領域 */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? '判定実行中...' : '判定実行'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClear}
              disabled={isLoading}
            >
              入力内容をクリア
            </Button>
          </div>
        </form>
      </div>

      {/* クリア確認ダイアログ */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="入力内容を削除しますか？"
        message="すべての入力内容が削除されます。この操作は元に戻せません。"
        confirmLabel="はい"
        cancelLabel="いいえ"
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
      />
    </div>
  );
}
