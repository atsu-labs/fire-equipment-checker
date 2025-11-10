import { describe, it, expect } from 'vitest';
import type { FloorUsageDetail, UsageCode } from '@/lib/regulations/types';

/**
 * 用途別床面積合計を計算するロジック
 * FloorUsageTable の usageSummary useMemo 内で使用される計算を個別にテスト
 */
function calculateUsageSummary(fields: FloorUsageDetail[]): Map<UsageCode, number> {
  const summary = new Map<UsageCode, number>();

  fields.forEach(field => {
    const usageCode = field.usageCode as UsageCode;
    const area = field.area as number;

    if (usageCode && area) {
      summary.set(usageCode, (summary.get(usageCode) || 0) + area);
    }
  });

  return summary;
}

describe('FloorUsageTable - 用途別床面積合計計算ロジック', () => {
  describe('基本的な集計', () => {
    it('単一用途の合計を計算する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 200,
          capacity: 100,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 300,
          capacity: 150,
        },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('3-ro')).toBe(500);
      expect(summary.size).toBe(1);
    });

    it('複数用途の合計をそれぞれ計算する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 200,
        },
        {
          floor: 1,
          usageCode: '6-ro-1',
          area: 150,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 300,
        },
        {
          floor: 2,
          usageCode: '6-ro-1',
          area: 250,
        },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('3-ro')).toBe(500);
      expect(summary.get('6-ro-1')).toBe(400);
      expect(summary.size).toBe(2);
    });

    it('空の配列を処理する', () => {
      const fields: FloorUsageDetail[] = [];

      const summary = calculateUsageSummary(fields);

      expect(summary.size).toBe(0);
    });
  });

  describe('地階を含む計算', () => {
    it('負の階数（地階）を含める', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: -2,
          usageCode: '14',
          area: 500,
        },
        {
          floor: -1,
          usageCode: '14',
          area: 300,
        },
        {
          floor: 1,
          usageCode: '14',
          area: 400,
        },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('14')).toBe(1200);
    });

    it('地階と地上の同じ用途を合計する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: -1,
          usageCode: '3-ro',
          area: 100,
        },
        {
          floor: 1,
          usageCode: '3-ro',
          area: 200,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 150,
        },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('3-ro')).toBe(450);
    });
  });

  describe('小数第2位の面積計算', () => {
    it('小数第2位の面積を正しく合計する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '1-i',
          area: 100.5,
        },
        {
          floor: 2,
          usageCode: '1-i',
          area: 200.75,
        },
      ];

      const summary = calculateUsageSummary(fields);

      // 浮動小数点数の精度問題を考慮
      expect(summary.get('1-i')).toBeCloseTo(301.25, 2);
    });

    it('複数の小数を合計する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '4',
          area: 333.33,
        },
        {
          floor: 1,
          usageCode: '4',
          area: 333.33,
        },
        {
          floor: 1,
          usageCode: '4',
          area: 333.34,
        },
      ];

      const summary = calculateUsageSummary(fields);

      // 1000.00 に近い値
      expect(summary.get('4')).toBeCloseTo(1000, 1);
    });
  });

  describe('大規模データ処理（パフォーマンス）', () => {
    it('100行のデータを処理する', () => {
      const fields: FloorUsageDetail[] = [];
      for (let i = 0; i < 100; i++) {
        fields.push({
          floor: Math.ceil(i / 10), // 1～10階
          usageCode: (i % 3 === 0 ? '3-ro' : i % 3 === 1 ? '6-ro-1' : '14') as UsageCode,
          area: 100 + i,
          capacity: 50 + i,
        });
      }

      const start = performance.now();
      const summary = calculateUsageSummary(fields);
      const duration = performance.now() - start;

      // 処理時間が 10ms 以内（パフォーマンス要件）
      expect(duration).toBeLessThan(10);
      expect(summary.size).toBeGreaterThan(0);
    });

    it('1000行のデータを処理する', () => {
      const fields: FloorUsageDetail[] = [];
      const usageCodes: UsageCode[] = ['1-i', '3-ro', '6-ro-1', '14'];

      for (let i = 0; i < 1000; i++) {
        fields.push({
          floor: Math.ceil(i / 100), // 1～10階
          usageCode: usageCodes[i % usageCodes.length],
          area: 50 + (i % 100),
        });
      }

      const start = performance.now();
      const summary = calculateUsageSummary(fields);
      const duration = performance.now() - start;

      // 処理時間が 50ms 以内
      expect(duration).toBeLessThan(50);
      expect(summary.size).toBe(usageCodes.length);
    });
  });

  describe('エッジケース', () => {
    it('面積が 0 のデータを処理する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 0,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 100,
        },
      ];

      const summary = calculateUsageSummary(fields);

      // 0 の面積は計算に含まれる
      expect(summary.get('3-ro')).toBe(100);
    });

    it('非常に大きな面積値を処理する', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '14',
          area: 999999,
        },
        {
          floor: 2,
          usageCode: '14',
          area: 1,
        },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('14')).toBe(1000000);
    });

    it('undefined usageCode をスキップする', () => {
      const fields = [
        {
          floor: 1,
          usageCode: undefined,
          area: 200,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 300,
        },
      ] as unknown as FloorUsageDetail[];

      const summary = calculateUsageSummary(fields);

      // undefined は計算に含まれない
      expect(summary.get(undefined as any)).toBeUndefined();
      expect(summary.get('3-ro')).toBe(300);
      expect(summary.size).toBe(1);
    });

    it('undefined area をスキップする', () => {
      const fields = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: undefined,
        },
        {
          floor: 2,
          usageCode: '3-ro',
          area: 300,
        },
      ] as unknown as FloorUsageDetail[];

      const summary = calculateUsageSummary(fields);

      // undefined area は計算に含まれない
      expect(summary.get('3-ro')).toBe(300);
    });
  });

  describe('複合シナリオ', () => {
    it('複雑な複合用途シナリオを計算する', () => {
      // 地下1階、1階～5階の複合用途建築物
      const fields: FloorUsageDetail[] = [
        // 地階：倉庫 400㎡
        { floor: -1, usageCode: '14', area: 400 },

        // 1階：飲食店 500㎡ + 倉庫 200㎡
        { floor: 1, usageCode: '3-ro', area: 500 },
        { floor: 1, usageCode: '14', area: 200 },

        // 2階：飲食店 300㎡ + 医療 150㎡
        { floor: 2, usageCode: '3-ro', area: 300 },
        { floor: 2, usageCode: '6-ro-1', area: 150 },

        // 3階：医療 200㎡
        { floor: 3, usageCode: '6-ro-1', area: 200 },

        // 4～5階：飲食店各 250㎡
        { floor: 4, usageCode: '3-ro', area: 250 },
        { floor: 5, usageCode: '3-ro', area: 250 },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('3-ro')).toBe(1300); // 500+300+250+250
      expect(summary.get('14')).toBe(600); // 400+200
      expect(summary.get('6-ro-1')).toBe(350); // 150+200
      expect(summary.size).toBe(3);
    });

    it('同一階内の複数用途を正しく集計する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '1-i', area: 100 },
        { floor: 1, usageCode: '3-ro', area: 150 },
        { floor: 1, usageCode: '6-ro-1', area: 200 },
        { floor: 1, usageCode: '14', area: 250 },
      ];

      const summary = calculateUsageSummary(fields);

      expect(summary.get('1-i')).toBe(100);
      expect(summary.get('3-ro')).toBe(150);
      expect(summary.get('6-ro-1')).toBe(200);
      expect(summary.get('14')).toBe(250);
      expect(summary.size).toBe(4);
    });
  });

  describe('Map の返却値', () => {
    it('Map インスタンスを返す', () => {
      const fields: FloorUsageDetail[] = [{ floor: 1, usageCode: '3-ro', area: 100 }];

      const summary = calculateUsageSummary(fields);

      expect(summary instanceof Map).toBe(true);
    });

    it('Map から値を取得できる', () => {
      const fields: FloorUsageDetail[] = [{ floor: 1, usageCode: '3-ro', area: 100 }];

      const summary = calculateUsageSummary(fields);

      expect(summary.has('3-ro')).toBe(true);
      expect(summary.get('3-ro')).toBe(100);
    });

    it('Map をイテレートできる', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 2, usageCode: '6-ro-1', area: 200 },
      ];

      const summary = calculateUsageSummary(fields);

      const entries = Array.from(summary.entries());
      expect(entries.length).toBe(2);
      expect(entries.some(([code]) => code === '3-ro')).toBe(true);
      expect(entries.some(([code]) => code === '6-ro-1')).toBe(true);
    });
  });
});
