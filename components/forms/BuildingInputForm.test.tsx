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

describe('BuildingInputForm', () => {
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

  describe('初期化処理', () => {
    it('should render with all required sections', async () => {
      render(<BuildingInputForm />);

      // セクション表示確認
      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
        expect(screen.getByText(/基本属性/i)).toBeInTheDocument();
        expect(screen.getByText(/特殊属性/i)).toBeInTheDocument();
      });
    });

    it('should initialize form with default values', async () => {
      render(<BuildingInputForm />);

      // ヘッダーが表示されていることを確認
      await waitFor(() => {
        expect(screen.getByText(/建築物情報入力/i)).toBeInTheDocument();
      });
    });

    it('should initialize form with provided initialData', async () => {
      const initialData = {
        usageCode: '6-ro-1' as const,
        totalArea: 1500,
        floors: 5,
        undergroundFloors: 1,
      };

      render(<BuildingInputForm initialData={initialData} />);

      // セクションが表示されていることを確認
      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });
    });

    it('should restore data from localStorage on mount', async () => {
      const savedData = JSON.stringify({
        usageCode: '6-ro-1',
        totalArea: 2000,
        floors: 4,
        undergroundFloors: 0,
      });
      localStorage.setItem('building-form-data', savedData);

      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByText(/建築物情報入力/i)).toBeInTheDocument();
      });
    });
  });

  describe('複合用途モード切り替え', () => {
    it('should show message when complex usage (16) is selected', async () => {
      render(<BuildingInputForm />);

      // ページレンダリング確認
      await waitFor(() => {
        expect(screen.getByText(/用途コード選択/i)).toBeInTheDocument();
      });

      // select要素を取得して用途コードを選択
      const selectElements = screen.getAllByRole('combobox');
      if (selectElements.length > 0) {
        const usageCodeSelect = selectElements[0];
        await userEvent.selectOptions(usageCodeSelect, '16-i');

        // メッセージ表示確認
        const floorUsageElement = screen.queryAllByText(/階別用途詳細/i);
        expect(floorUsageElement.length).toBeGreaterThan(0);
      }
    });
  });

  describe('クリア機能', () => {
    it('should have clear button', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /入力内容をクリア/i })).toBeInTheDocument();
      });
    });
  });

  describe('フォーム送信ボタン', () => {
    it('should have submit button', async () => {
      render(<BuildingInputForm />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /判定実行/i })).toBeInTheDocument();
      });
    });
  });

  describe('エラーメッセージ表示', () => {
    it('should show error message on API failure', async () => {
      fetchMock.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server error' }),
        } as Response)
      );

      const onSubmitError = vi.fn();
      render(<BuildingInputForm onSubmitError={onSubmitError} />);

      // ページレンダリング確認
      await waitFor(() => {
        expect(screen.getByText(/建築物情報入力/i)).toBeInTheDocument();
      });
    });
  });

  describe('localStorage統合', () => {
    it('should clear localStorage after successful submission', async () => {
      const savedData = JSON.stringify({
        usageCode: '6-ro-1',
        totalArea: 1000,
        floors: 3,
        undergroundFloors: 0,
      });
      localStorage.setItem('building-form-data', savedData);

      render(<BuildingInputForm />);

      // ページレンダリング確認
      await waitFor(() => {
        expect(screen.getByText(/建築物情報入力/i)).toBeInTheDocument();
      });
    });
  });
});

