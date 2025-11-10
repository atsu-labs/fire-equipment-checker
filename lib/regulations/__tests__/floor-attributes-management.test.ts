import { describe, it, expect } from 'vitest';
import type { FloorUsageDetail, UsageCode } from '@/lib/regulations/types';

/**
 * 階全体属性の共通設定管理ロジック
 * 同一階の複数用途で共通する属性を管理
 */
function updateFloorAttributes(
  fields: FloorUsageDetail[],
  floor: number,
  attributes: {
    isWindowless?: boolean;
    isEvacuationFloor?: boolean;
    directStairCount?: number;
    hasEffectiveOutdoorStair?: boolean;
    hasFirewallSeparation?: boolean;
  }
): FloorUsageDetail[] {
  return fields.map(field => {
    if (field.floor === floor) {
      return {
        ...field,
        ...attributes,
      };
    }
    return field;
  });
}

/**
 * 指定階の全行を取得
 */
function getFloorDetails(fields: FloorUsageDetail[], floor: number): FloorUsageDetail[] {
  return fields.filter(field => field.floor === floor);
}

describe('FloorUsageTable - 階全体属性の共通設定管理', () => {
  describe('基本的な属性更新', () => {
    it('同一階の全行に無窓階属性を設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 1, usageCode: '6-ro-1', area: 150 },
        { floor: 2, usageCode: '3-ro', area: 200 },
      ];

      const updated = updateFloorAttributes(fields, 1, {
        isWindowless: true,
      });

      const floor1Details = getFloorDetails(updated, 1);
      expect(floor1Details).toHaveLength(2);
      expect(floor1Details[0].isWindowless).toBe(true);
      expect(floor1Details[1].isWindowless).toBe(true);
      expect(getFloorDetails(updated, 2)[0].isWindowless).toBeUndefined();
    });

    it('同一階の全行に避難階属性を設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 1, usageCode: '6-ro-1', area: 150 },
      ];

      const updated = updateFloorAttributes(fields, 1, {
        isEvacuationFloor: true,
      });

      const floor1Details = getFloorDetails(updated, 1);
      floor1Details.forEach(detail => {
        expect(detail.isEvacuationFloor).toBe(true);
      });
    });

    it('同一階の全行に直通階段数を設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 3, usageCode: '3-ro', area: 100 },
        { floor: 3, usageCode: '6-ro-1', area: 150 },
        { floor: 3, usageCode: '14', area: 200 },
      ];

      const updated = updateFloorAttributes(fields, 3, {
        directStairCount: 2,
      });

      const floor3Details = getFloorDetails(updated, 3);
      floor3Details.forEach(detail => {
        expect(detail.directStairCount).toBe(2);
      });
    });
  });

  describe('複数属性の同時設定', () => {
    it('複数の属性を同時に設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 2, usageCode: '3-ro', area: 100 },
        { floor: 2, usageCode: '6-ro-1', area: 150 },
      ];

      const updated = updateFloorAttributes(fields, 2, {
        isWindowless: true,
        isEvacuationFloor: false,
        directStairCount: 1,
        hasEffectiveOutdoorStair: true,
        hasFirewallSeparation: false,
      });

      const floor2Details = getFloorDetails(updated, 2);
      floor2Details.forEach(detail => {
        expect(detail.isWindowless).toBe(true);
        expect(detail.isEvacuationFloor).toBe(false);
        expect(detail.directStairCount).toBe(1);
        expect(detail.hasEffectiveOutdoorStair).toBe(true);
        expect(detail.hasFirewallSeparation).toBe(false);
      });
    });

    it('既存属性を上書きする', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 100,
          isWindowless: false,
          directStairCount: 0,
        },
        {
          floor: 1,
          usageCode: '6-ro-1',
          area: 150,
          isWindowless: true,
          directStairCount: 1,
        },
      ];

      const updated = updateFloorAttributes(fields, 1, {
        isWindowless: true,
        directStairCount: 2,
      });

      const floor1Details = getFloorDetails(updated, 1);
      floor1Details.forEach(detail => {
        expect(detail.isWindowless).toBe(true);
        expect(detail.directStairCount).toBe(2);
      });
    });

    it('部分的に属性を更新する（他の属性は保持）', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 100,
          capacity: 50,
          isWindowless: false,
          isEvacuationFloor: true,
          directStairCount: 1,
        },
      ];

      const updated = updateFloorAttributes(fields, 1, {
        isWindowless: true,
      });

      const floor1Detail = updated[0];
      expect(floor1Detail.isWindowless).toBe(true);
      expect(floor1Detail.isEvacuationFloor).toBe(true); // 保持
      expect(floor1Detail.directStairCount).toBe(1); // 保持
      expect(floor1Detail.capacity).toBe(50); // 保持
    });
  });

  describe('地階を含む属性設定', () => {
    it('地階（負の階数）に属性を設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: -1, usageCode: '14', area: 100 },
        { floor: -1, usageCode: '14', area: 150 },
      ];

      const updated = updateFloorAttributes(fields, -1, {
        isWindowless: true,
      });

      const floor_1Details = getFloorDetails(updated, -1);
      floor_1Details.forEach(detail => {
        expect(detail.isWindowless).toBe(true);
      });
    });

    it('複数階（地階を含む）に異なる属性を設定する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: -1, usageCode: '14', area: 100 },
        { floor: -1, usageCode: '14', area: 100 },
        { floor: 1, usageCode: '3-ro', area: 200 },
        { floor: 1, usageCode: '3-ro', area: 200 },
      ];

      const updated1 = updateFloorAttributes(fields, -1, {
        isWindowless: true,
      });
      const updated2 = updateFloorAttributes(updated1, 1, {
        isEvacuationFloor: true,
      });

      const floor_1Details = getFloorDetails(updated2, -1);
      const floor1Details = getFloorDetails(updated2, 1);

      floor_1Details.forEach(detail => {
        expect(detail.isWindowless).toBe(true);
        expect(detail.isEvacuationFloor).toBeUndefined();
      });

      floor1Details.forEach(detail => {
        expect(detail.isWindowless).toBeUndefined();
        expect(detail.isEvacuationFloor).toBe(true);
      });
    });
  });

  describe('階の選択と取得', () => {
    it('指定階の全行を取得する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 1, usageCode: '6-ro-1', area: 150 },
        { floor: 2, usageCode: '3-ro', area: 200 },
        { floor: 3, usageCode: '14', area: 300 },
      ];

      const floor1Details = getFloorDetails(fields, 1);

      expect(floor1Details).toHaveLength(2);
      expect(floor1Details[0].floor).toBe(1);
      expect(floor1Details[1].floor).toBe(1);
    });

    it('複数階を順に処理する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 1, usageCode: '6-ro-1', area: 150 },
        { floor: 2, usageCode: '3-ro', area: 200 },
      ];

      // 1階を処理
      let updated = updateFloorAttributes(fields, 1, {
        isWindowless: false,
      });

      // 2階を処理
      updated = updateFloorAttributes(updated, 2, {
        isWindowless: true,
      });

      const floor1Details = getFloorDetails(updated, 1);
      const floor2Details = getFloorDetails(updated, 2);

      expect(floor1Details[0].isWindowless).toBe(false);
      expect(floor2Details[0].isWindowless).toBe(true);
    });

    it('存在しない階を指定した場合、何も変更されない', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 2, usageCode: '3-ro', area: 200 },
      ];

      const updated = updateFloorAttributes(fields, 99, {
        isWindowless: true,
      });

      expect(updated).toEqual(fields);
    });
  });

  describe('UI統合シナリオ', () => {
    it('ユーザーが階全体属性パネルで値を変更する', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 2, usageCode: '3-ro', area: 100 },
        { floor: 2, usageCode: '6-ro-1', area: 150 },
        { floor: 3, usageCode: '14', area: 200 },
      ];

      // ユーザーが2階を選択し、無窓階チェックボックスをON
      let updated = updateFloorAttributes(fields, 2, {
        isWindowless: true,
      });

      // ユーザーが直通階段数を入力
      updated = updateFloorAttributes(updated, 2, {
        directStairCount: 2,
      });

      // ユーザーが避難階チェックボックスをON
      updated = updateFloorAttributes(updated, 2, {
        isEvacuationFloor: true,
      });

      const floor2Details = getFloorDetails(updated, 2);
      floor2Details.forEach(detail => {
        expect(detail.isWindowless).toBe(true);
        expect(detail.directStairCount).toBe(2);
        expect(detail.isEvacuationFloor).toBe(true);
      });

      // 3階は変更されない
      const floor3Details = getFloorDetails(updated, 3);
      expect(floor3Details[0].isWindowless).toBeUndefined();
      expect(floor3Details[0].directStairCount).toBeUndefined();
    });

    it('複数階の属性を段階的に設定する（複合用途シナリオ）', () => {
      const fields: FloorUsageDetail[] = [
        { floor: -1, usageCode: '14', area: 400 },
        { floor: 1, usageCode: '3-ro', area: 200 },
        { floor: 1, usageCode: '6-ro-1', area: 100 },
        { floor: 2, usageCode: '3-ro', area: 200 },
        { floor: 2, usageCode: '6-ro-1', area: 100 },
        { floor: 3, usageCode: '6-ro-1', area: 200 },
      ];

      let updated = fields;

      // 地階：無窓階を設定
      updated = updateFloorAttributes(updated, -1, {
        isWindowless: true,
      });

      // 1階：避難階を設定
      updated = updateFloorAttributes(updated, 1, {
        isEvacuationFloor: true,
      });

      // 3階以上：直通階段数を設定
      updated = updateFloorAttributes(updated, 3, {
        directStairCount: 2,
      });

      // 検証
      expect(getFloorDetails(updated, -1)[0].isWindowless).toBe(true);
      expect(getFloorDetails(updated, 1)[0].isEvacuationFloor).toBe(true);
      expect(getFloorDetails(updated, 3)[0].directStairCount).toBe(2);
    });

    it('階を削除した後、属性は適用されない', () => {
      let fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100 },
        { floor: 1, usageCode: '6-ro-1', area: 150 },
      ];

      // 属性を設定
      fields = updateFloorAttributes(fields, 1, {
        isWindowless: true,
      });

      // 階を削除（シミュレーション）
      fields = fields.filter(f => f.floor !== 1);

      // 削除後に属性を再設定しようとしても効果なし
      const updated = updateFloorAttributes(fields, 1, {
        isWindowless: false,
      });

      expect(getFloorDetails(updated, 1)).toHaveLength(0);
    });
  });

  describe('データ完全性', () => {
    it('属性更新後も他の行は影響を受けない', () => {
      const fields: FloorUsageDetail[] = [
        { floor: 1, usageCode: '3-ro', area: 100, capacity: 50 },
        { floor: 2, usageCode: '3-ro', area: 200, capacity: 100 },
        { floor: 3, usageCode: '3-ro', area: 300, capacity: 150 },
      ];

      const originalFields = JSON.parse(JSON.stringify(fields)); // ディープコピー

      const updated = updateFloorAttributes(fields, 2, {
        isWindowless: true,
      });

      // 1階と3階は変更されない
      expect(updated[0]).toEqual(originalFields[0]);
      expect(updated[2]).toEqual(originalFields[2]);

      // 2階のみ変更
      expect(updated[1].isWindowless).toBe(true);
    });

    it('用途コード、面積、収容人員は変更されない', () => {
      const fields: FloorUsageDetail[] = [
        {
          floor: 1,
          usageCode: '3-ro',
          area: 150.5,
          capacity: 75,
        },
      ];

      const updated = updateFloorAttributes(fields, 1, {
        isWindowless: true,
        directStairCount: 2,
      });

      expect(updated[0].floor).toBe(1);
      expect(updated[0].usageCode).toBe('3-ro');
      expect(updated[0].area).toBe(150.5);
      expect(updated[0].capacity).toBe(75);
    });
  });

  describe('パフォーマンス', () => {
    it('大規模データでも高速に属性を更新する', () => {
      const fields: FloorUsageDetail[] = [];
      for (let i = 1; i <= 10; i++) {
        for (let j = 0; j < 10; j++) {
          fields.push({
            floor: i,
            usageCode: '3-ro' as UsageCode,
            area: 100 + j,
          });
        }
      }

      const start = performance.now();
      const updated = updateFloorAttributes(fields, 5, {
        isWindowless: true,
      });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10); // 10ms以内
      expect(getFloorDetails(updated, 5).length).toBe(10);
      expect(getFloorDetails(updated, 5)[0].isWindowless).toBe(true);
    });
  });
});
