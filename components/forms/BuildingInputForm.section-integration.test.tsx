import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BuildingInputForm } from './BuildingInputForm';

// ルーターモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('BuildingInputForm - Section Integration (Task 7.2)', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          building: {
            usageCode: '6-ro-1',
            totalArea: 1000,
            floors: 3,
            undergroundFloors: 0,
          },
          requiredEquipment: [],
          judgmentDate: new Date().toISOString(),
          legalVersion: '2025-01',
        }),
      } as Response)
    );

    // localStorageモック
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach(key => delete store[key]);
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('セクション統合 - 構造', () => {
    it('should render all three main section headers', () => {
      render(<BuildingInputForm />);

      expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      expect(screen.getByText(/基本属性/i)).toBeInTheDocument();
      expect(screen.getByText(/特殊属性/i)).toBeInTheDocument();
    });

    it('should render page title and description', () => {
      render(<BuildingInputForm />);

      expect(screen.getByText(/建築物情報入力/i)).toBeInTheDocument();
      expect(screen.getByText(/消防法施行令に基づく必要設備を自動判別します/i)).toBeInTheDocument();
    });

    it('should have proper form wrapper with Tailwind classes', () => {
      const { container } = render(<BuildingInputForm />);

      const form = container.querySelector('form');
      expect(form).toHaveClass('bg-white');
      expect(form).toHaveClass('rounded-lg');
      expect(form).toHaveClass('shadow-md');
      expect(form).toHaveClass('p-6');
      expect(form).toHaveClass('space-y-6');
    });

    it('should have proper page container with max-width', () => {
      const { container } = render(<BuildingInputForm />);

      const maxWidthDiv = container.querySelector('.max-w-2xl');
      expect(maxWidthDiv).toBeInTheDocument();
    });
  });

  describe('セクション統合 - コンポーネント配置', () => {
    it('should integrate UsageCodeSelect component', () => {
      render(<BuildingInputForm />);

      const selectCombobox = screen.getAllByRole('combobox');
      expect(selectCombobox.length).toBeGreaterThan(0);
    });

    it('should integrate BasicAttributesSection component', () => {
      render(<BuildingInputForm />);

      // BasicAttributesSection has three fields (複数ある場合は最初のものを確認)
      expect(screen.getByText(/基本属性/i)).toBeInTheDocument();
      const totalAreaInputs = screen.getAllByLabelText(/延床面積/i);
      const floorsInputs = screen.getAllByLabelText(/階数/i);
      const undergroundFloorsInputs = screen.getAllByLabelText(/地階数/i);

      // 基本属性セクションの入力フィールドが存在する
      expect(totalAreaInputs.length).toBeGreaterThan(0);
      expect(floorsInputs.length).toBeGreaterThan(0);
      expect(undergroundFloorsInputs.length).toBeGreaterThan(0);
    });

    it('should integrate SpecialAttributesSection component', () => {
      render(<BuildingInputForm />);

      expect(screen.getByLabelText(/無窓階/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/避難階/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/避難上有効な屋外階段/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/防火壁区画/i)).toBeInTheDocument();
    });

    it('should show submit and clear buttons', () => {
      render(<BuildingInputForm />);

      expect(screen.getByRole('button', { name: /判定実行/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /入力内容をクリア/i })).toBeInTheDocument();
    });
  });

  describe('セクション統合 - データ共有（control/errors）', () => {
    it('should share control prop across sections', async () => {
      render(<BuildingInputForm />);

      // すべてのセクションが共通の control を使用していることを確認
      // UsageCodeSelect が選択できる
      const selectElements = screen.getAllByRole('combobox');
      expect(selectElements.length).toBeGreaterThan(0);

      await userEvent.selectOptions(selectElements[0], '6-ro-1');

      // 選択が反映されたことを確認
      expect((selectElements[0] as HTMLSelectElement).value).toBe('6-ro-1');
    });

    it('should pass data through multiple sections', async () => {
      render(<BuildingInputForm />);

      // 用途コード選択
      const selectElements = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selectElements[0], '6-ro-1');

      // 基本属性入力（複数の同じラベルがある場合は最初のものを取得）
      const totalAreaInputs = screen.getAllByLabelText(/延床面積/i);
      const floorsInputs = screen.getAllByLabelText(/階数/i);
      const undergroundFloorsInputs = screen.getAllByLabelText(/地階数/i);

      const totalAreaInput = totalAreaInputs[0] as HTMLInputElement;
      const floorsInput = floorsInputs[0] as HTMLInputElement;
      const undergroundFloorsInput = undergroundFloorsInputs[0] as HTMLInputElement;

      await userEvent.type(totalAreaInput, '1000');
      await userEvent.type(floorsInput, '3');
      await userEvent.type(undergroundFloorsInput, '0');

      // 入力が反映されたことを確認
      expect(totalAreaInput.value).toBe('1000');
      expect(floorsInput.value).toBe('3');
      expect(undergroundFloorsInput.value).toBe('0');
    });
  });

  describe('セクション統合 - レスポンシブレイアウト', () => {
    it('should render sections in vertical stack with proper spacing', () => {
      const { container } = render(<BuildingInputForm />);

      const form = container.querySelector('form');
      expect(form).toHaveClass('space-y-6');

      // セクション分割がある
      const sections = form?.querySelectorAll('div > div');
      expect(sections?.length).toBeGreaterThan(0);
    });

    it('should have flex layout for button section', () => {
      const { container } = render(<BuildingInputForm />);

      const buttonSection = container.querySelector('.flex.gap-4');
      expect(buttonSection).toBeInTheDocument();
    });
  });

  describe('セクション統合 - 複合用途条件付きレンダリング', () => {
    it('should show FloorUsageTable when complex usage (16) is selected', async () => {
      render(<BuildingInputForm />);

      // 最初は表示されない
      expect(screen.queryByRole('button', { name: /行を追加/i })).not.toBeInTheDocument();

      // 複合用途を選択
      const selectElements = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selectElements[0], '16-i');

      // テーブルが表示される
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /行を追加/i })).toBeInTheDocument();
      });
    });

    it('should hide floor usage details for non-complex usage', async () => {
      render(<BuildingInputForm />);

      // 単一用途を選択
      const selectElements = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selectElements[0], '6-ro-1');

      // テーブルが表示されない
      expect(screen.queryByRole('button', { name: /行を追加/i })).not.toBeInTheDocument();
    });
  });

  describe('セクション統合 - watch値の伝播', () => {
    it('should show directStairCount field when floors >= 3', async () => {
      render(<BuildingInputForm />);

      // 最初は表示されない
      expect(screen.queryByLabelText(/直通階段数/i)).not.toBeInTheDocument();

      // 階数を3に設定（複数ある場合は最初のものを取得）
      const floorsInputs = screen.getAllByLabelText(/階数/i);
      const floorsInput = floorsInputs[0] as HTMLInputElement;
      await userEvent.type(floorsInput, '3');

      // 表示される
      await waitFor(() => {
        expect(screen.getByLabelText(/直通階段数/i)).toBeInTheDocument();
      });
    });

    it('should hide directStairCount field when floors < 3', async () => {
      render(<BuildingInputForm />);

      // 階数を2に設定（複数ある場合は最初のものを取得）
      const floorsInputs = screen.getAllByLabelText(/階数/i);
      const floorsInput = floorsInputs[0] as HTMLInputElement;
      await userEvent.type(floorsInput, '2');

      // 表示されない
      expect(screen.queryByLabelText(/直通階段数/i)).not.toBeInTheDocument();
    });
  });

  describe('セクション統合 - 完全なフロー', () => {
    it('should support complete user data entry across all sections', async () => {
      render(<BuildingInputForm />);

      // Step 1: 用途コード選択セクション
      const selectElements = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selectElements[0], '6-ro-1');

      // Step 2: 基本属性セクション（複数ある場合は最初のものを取得）
      const totalAreaInputs = screen.getAllByLabelText(/延床面積/i);
      const floorsInputs = screen.getAllByLabelText(/階数/i);
      const undergroundFloorsInputs = screen.getAllByLabelText(/地階数/i);

      const totalAreaInput = totalAreaInputs[0] as HTMLInputElement;
      const floorsInput = floorsInputs[0] as HTMLInputElement;
      const undergroundFloorsInput = undergroundFloorsInputs[0] as HTMLInputElement;

      await userEvent.type(totalAreaInput, '1000');
      await userEvent.type(floorsInput, '3');
      await userEvent.type(undergroundFloorsInput, '0');

      // Step 3: 特殊属性セクション - directStairCountが表示される
      await waitFor(() => {
        expect(screen.getByLabelText(/直通階段数/i)).toBeInTheDocument();
      });

      const directStairInput = screen.getByLabelText(/直通階段数/i) as HTMLInputElement;
      await userEvent.type(directStairInput, '2');

      // すべてのセクションでデータが入力されたことを確認
      expect((selectElements[0] as HTMLSelectElement).value).toBe('6-ro-1');
      expect(totalAreaInput.value).toBe('1000');
      expect(floorsInput.value).toBe('3');
      expect(undergroundFloorsInput.value).toBe('0');
      expect(directStairInput.value).toBe('2');
    });
  });

  describe('Task 7.3: 複合用途モード切り替え機能', () => {
    it('should show FloorUsageTable when complex usage (16) code is selected', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // 複合用途を選択
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '16-i');
      }

      // FloorUsageTableが表示されることを確認（テーブルのヘッダーが見える）
      await waitFor(() => {
        // "行を追加" ボタンがあることを確認（FloorUsageTableの一部）
        const addRowButton = screen.queryByRole('button', { name: /行を追加/i });
        expect(addRowButton).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display complex usage table with proper headers when 16 code is selected', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // 複合用途を選択
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '16-i');
      }

      // FloorUsageTableが表示されることを確認（テーブルの「行を追加」ボタンで確認）
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /行を追加/i })).toBeInTheDocument();
        
        // FloorUsageTable特有のヘッダーセルを確認
        const tableHeaderCells = screen.getAllByRole('columnheader', { name: /階数|用途コード|床面積|収容人員/ });
        expect(tableHeaderCells.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should hide FloorUsageTable when switching from complex to single usage', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // 複合用途を選択
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '16-i');
      }

      // FloorUsageTableが表示されることを確認
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /行を追加/i })).toBeInTheDocument();
      }, { timeout: 3000 });

      // 単一用途に切り替え
      const selectElements2 = screen.getAllByRole('combobox');
      if (selectElements2.length > 0) {
        await userEvent.selectOptions(selectElements2[0], '6-ro-1');
      }

      // FloorUsageTableが非表示になることを確認
      await waitFor(() => {
        const addRowButton = screen.queryByRole('button', { name: /行を追加/i });
        expect(addRowButton).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Task 7.4: バリデーションとボタン制御', () => {
    it('should disable submit button when there are validation errors', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /判定実行/i });
        // 初期状態では必須フィールドが未入力なのでdisabledであるべき
        expect(submitButton).toBeDisabled();
      });
    });

    it('should disable submit button until all required fields are filled', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /判定実行/i });
        expect(submitButton).toBeDisabled();
      });

      // 用途コードのみ入力
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '6-ro-1');
      }

      // まだdisabledのままであるべき（他の必須フィールドが未入力）
      const submitButton = screen.getByRole('button', { name: /判定実行/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button during form submission (isLoading)', async () => {
      // APIをゆっくり返すようモック
      fetchMock.mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({
                building: {
                  usageCode: '6-ro-1',
                  totalArea: 1000,
                  floors: 3,
                  undergroundFloors: 0,
                },
                requiredEquipment: [],
                judgmentDate: new Date().toISOString(),
                legalVersion: '2025-01',
              }),
            } as Response);
          }, 500)
        )
      );

      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // フォーム入力
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '6-ro-1');
      }

      const inputs = screen.getAllByLabelText(/延床面積|階数|地階数/i);
      if (inputs.length >= 3) {
        await userEvent.type(inputs[0], '1000');
        await userEvent.type(inputs[1], '3');
        await userEvent.type(inputs[2], '0');
      }

      // 送信
      const submitButton = screen.getByRole('button', { name: /判定実行/i });
      await userEvent.click(submitButton);

      // 送信中はボタンがdisabledであるべき
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      }, { timeout: 1000 });
    });

    it('should disable submit button for complex usage without floorUsageDetails', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // 複合用途を選択
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        await userEvent.selectOptions(selectElements[0], '16-i');
      }

      // 基本属性のみ入力
      const inputs = screen.getAllByLabelText(/延床面積|階数|地階数/i);
      if (inputs.length >= 3) {
        await userEvent.type(inputs[0], '1000');
        await userEvent.type(inputs[1], '3');
        await userEvent.type(inputs[2], '0');
      }

      // 複合用途でfloorUsageDetailsが空なのでボタンはdisabledであるべき
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /判定実行/i });
        expect(submitButton).toBeDisabled();
      }, { timeout: 3000 });
    });
  });
});
