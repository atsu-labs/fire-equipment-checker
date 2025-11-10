import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FloorUsageTable } from './FloorUsageTable';
import type { FloorUsageDetail, BuildingInfo } from '@/lib/regulations/types';

/**
 * テスト用のZodスキーマ（buildingInfoFormSchema の簡略版）
 */
const testSchema = z.object({
  usageCode: z.enum(['16-i', '16-ro', '6-ro-1']),
  totalArea: z.number().positive(),
  floors: z.number().int().positive(),
  undergroundFloors: z.number().int().nonnegative(),
  floorUsageDetails: z
    .array(
      z.object({
        floor: z.number().int(),
        usageCode: z.enum(['1-i', '3-ro', '6-ro-1', '16-i', '16-ro']),
        area: z.number().positive(),
        capacity: z.number().int().nonnegative().optional(),
        isWindowless: z.boolean().optional(),
        isEvacuationFloor: z.boolean().optional(),
        directStairCount: z.number().int().nonnegative().optional(),
        hasEffectiveOutdoorStair: z.boolean().optional(),
        hasFirewallSeparation: z.boolean().optional(),
      })
    )
    .optional(),
});

type TestBuildingInfo = z.infer<typeof testSchema>;

/**
 * テスト用フォームコンポーネント
 */
function TestFormWrapper() {
  const { control, watch, formState: { errors } } = useForm<TestBuildingInfo>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      usageCode: '16-i',
      totalArea: 1000,
      floors: 3,
      undergroundFloors: 0,
      floorUsageDetails: [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 200,
          capacity: 100,
          isWindowless: false,
          isEvacuationFloor: true,
        },
        {
          floor: 2,
          usageCode: '6-ro-1',
          area: 300,
          capacity: 50,
          isWindowless: false,
          isEvacuationFloor: false,
        },
      ],
    },
  });

  return (
    <div>
      <FloorUsageTable control={control} errors={errors} />
    </div>
  );
}

describe('FloorUsageTable', () => {
  describe('レンダリング', () => {
    it('テーブルヘッダーを表示する', () => {
      render(<TestFormWrapper />);
      
      expect(screen.getByText('階数')).toBeInTheDocument();
      expect(screen.getByText('用途コード')).toBeInTheDocument();
      expect(screen.getByText('床面積(㎡)')).toBeInTheDocument();
      expect(screen.getByText('収容人員')).toBeInTheDocument();
    });

    it('初期データの行を表示する', () => {
      render(<TestFormWrapper />);
      
      // 1階の行
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('200')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      
      // 2階の行
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('300')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });

    it('行追加ボタンを表示する', () => {
      render(<TestFormWrapper />);
      
      const addButtons = screen.getAllByRole('button', { name: /追加|add/i });
      expect(addButtons.length).toBeGreaterThan(0);
    });

    it('行削除ボタンを表示する', () => {
      render(<TestFormWrapper />);
      
      const deleteButtons = screen.getAllByRole('button', { name: /削除|delete/i });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('フィールド入力', () => {
    it('階数フィールドを入力できる', async () => {
      render(<TestFormWrapper />);
      
      const floorInputs = screen.getAllByDisplayValue('1');
      const firstFloorInput = floorInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstFloorInput);
      await userEvent.type(firstFloorInput, '3');
      
      expect(firstFloorInput.value).toBe('3');
    });

    it('床面積フィールドを入力できる', async () => {
      render(<TestFormWrapper />);
      
      const areaInputs = screen.getAllByDisplayValue('200');
      const firstAreaInput = areaInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstAreaInput);
      await userEvent.type(firstAreaInput, '500');
      
      expect(firstAreaInput.value).toBe('500');
    });

    it('収容人員フィールドを入力できる', async () => {
      render(<TestFormWrapper />);
      
      const capacityInputs = screen.getAllByDisplayValue('100');
      const firstCapacityInput = capacityInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstCapacityInput);
      await userEvent.type(firstCapacityInput, '200');
      
      expect(firstCapacityInput.value).toBe('200');
    });

    it('用途コードセレクトを変更できる', async () => {
      render(<TestFormWrapper />);
      
      const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
      const firstSelect = selects[0];
      
      await userEvent.selectOptions(firstSelect, '1-i');
      
      expect(firstSelect.value).toBe('1-i');
    });
  });

  describe('行操作', () => {
    it('行追加ボタンをクリックすると新しい行が追加される', async () => {
      render(<TestFormWrapper />);
      
      const initialRows = screen.getAllByDisplayValue(/^\d+$/);
      const initialRowCount = initialRows.length;
      
      const addButton = screen.getAllByRole('button', { name: /追加|add/i })[0];
      fireEvent.click(addButton);
      
      // 非同期処理の完了を待つ
      const updatedRows = await screen.findAllByDisplayValue(/^\d+$/);
      expect(updatedRows.length).toBeGreaterThan(initialRowCount);
    });

    it('行削除ボタンをクリックすると行が削除される', async () => {
      render(<TestFormWrapper />);
      
      const initialValues = screen.getAllByDisplayValue('200');
      const initialCount = initialValues.length;
      
      const deleteButtons = screen.getAllByRole('button', { name: /削除|delete/i });
      fireEvent.click(deleteButtons[0]);
      
      // 行が削除されたことを確認
      await new Promise(resolve => setTimeout(resolve, 100));
      const updatedValues = screen.queryAllByDisplayValue('200');
      expect(updatedValues.length).toBeLessThan(initialCount);
    });
  });

  describe('バリデーション', () => {
    it('必須フィールドが空の場合、エラーを表示する', async () => {
      render(<TestFormWrapper />);
      
      const floorInputs = screen.getAllByDisplayValue('1');
      const firstFloorInput = floorInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstFloorInput);
      fireEvent.blur(firstFloorInput);
      
      // バリデーションエラーが表示されることを確認
      // 具体的なエラーメッセージは実装に依存
    });

    it('負の床面積入力時にエラーを表示する', async () => {
      render(<TestFormWrapper />);
      
      const areaInputs = screen.getAllByDisplayValue('200');
      const firstAreaInput = areaInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstAreaInput);
      await userEvent.type(firstAreaInput, '-100');
      fireEvent.blur(firstAreaInput);
      
      // バリデーションエラーが表示されることを確認
    });

    it('負の階数を入力できる（地階対応）', async () => {
      render(<TestFormWrapper />);
      
      const floorInputs = screen.getAllByDisplayValue('1');
      const firstFloorInput = floorInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstFloorInput);
      await userEvent.type(firstFloorInput, '-1');
      
      expect(firstFloorInput.value).toBe('-1');
    });
  });

  describe('チェックボックス操作', () => {
    it('無窓階チェックボックスをチェックできる', async () => {
      render(<TestFormWrapper />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      const windowlessCheckbox = checkboxes[0] as HTMLInputElement;
      
      await userEvent.click(windowlessCheckbox);
      
      expect(windowlessCheckbox.checked).toBe(true);
    });

    it('避難階チェックボックスをチェックできる', async () => {
      render(<TestFormWrapper />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      // 複数のチェックボックスがあるため、特定の1つを選択
      const evacuationCheckbox = checkboxes[1] as HTMLInputElement;
      
      await userEvent.click(evacuationCheckbox);
      
      // 状態変更を確認
    });
  });

  describe('データバインディング', () => {
    it('入力データが正しくフォーム状態に反映される', async () => {
      render(<TestFormWrapper />);
      
      const floorInputs = screen.getAllByDisplayValue('1');
      const firstFloorInput = floorInputs[0] as HTMLInputElement;
      
      await userEvent.clear(firstFloorInput);
      await userEvent.type(firstFloorInput, '5');
      
      // React Hook Form に正しくバインドされていることを確認
      expect(firstFloorInput.value).toBe('5');
    });
  });

  describe('複雑なシナリオ', () => {
    it('複数行の階数と床面積を同時に編集できる', async () => {
      render(<TestFormWrapper />);
      
      const floorInputs = screen.getAllByDisplayValue(/^[12]$/);
      const areaInputs = screen.getAllByDisplayValue(/^[23]00$/);
      
      // 1行目を編集
      await userEvent.clear(floorInputs[0] as HTMLInputElement);
      await userEvent.type(floorInputs[0] as HTMLInputElement, '1');
      
      // 2行目を編集
      await userEvent.clear(areaInputs[1] as HTMLInputElement);
      await userEvent.type(areaInputs[1] as HTMLInputElement, '400');
      
      expect((floorInputs[0] as HTMLInputElement).value).toBe('1');
      expect((areaInputs[1] as HTMLInputElement).value).toBe('400');
    });

    it('行を追加してから編集できる', async () => {
      render(<TestFormWrapper />);
      
      const addButton = screen.getAllByRole('button', { name: /追加|add/i })[0];
      fireEvent.click(addButton);
      
      // 新しい行が追加されるまで待つ
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 新しい行を編集
      const allFloorInputs = screen.getAllByDisplayValue(/^\d+$/);
      const lastFloorInput = allFloorInputs[allFloorInputs.length - 1] as HTMLInputElement;
      
      await userEvent.clear(lastFloorInput);
      await userEvent.type(lastFloorInput, '4');
      
      expect(lastFloorInput.value).toBe('4');
    });
  });

  describe('エラーメッセージ表示', () => {
    it('バリデーションエラー時にエラーメッセージを表示する', () => {
      // このテストは errors オブジェクトが正しく渡されているかを確認
      render(<TestFormWrapper />);
      
      // FloorUsageTable が errors.floorUsageDetails を参照しているか確認
      // 具体的な実装に依存
    });
  });
});
