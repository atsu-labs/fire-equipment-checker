import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第10条 消火器具に関する基準のテスト
 */
describe('令第10条 消火器具', () => {
  describe('第1号イ 面積不問の用途', () => {
    it('(一)項イで面積不問で消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 100, // 小規模でも必要
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-001')).toBe(true);
    });

    it('(二)項で面積不問で消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
    });

    it('(六)項イ(1)で面積不問で消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-i-1',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
    });
  });

  describe('第2号 延べ面積150㎡以上', () => {
    it('(四)項で延べ150㎡以上なら消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '4',
        totalArea: 150,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-004')).toBe(true);
    });

    it('(四)項で延べ149㎡なら消火器は不要', () => {
      const building: BuildingInfo = {
        usageCode: '4',
        totalArea: 149,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeUndefined();
    });
  });

  describe('第3号 延べ面積300㎡以上', () => {
    it('(七)項で延べ300㎡以上なら消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '7',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-006')).toBe(true);
    });

    it('(七)項で延べ299㎡なら消火器は不要', () => {
      const building: BuildingInfo = {
        usageCode: '7',
        totalArea: 299,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeUndefined();
    });

    it('(十一)項で延べ300㎡以上なら消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
    });
  });

  describe('第4号 少量危険物・指定可燃物', () => {
    it('少量危険物(指定数量の1/5以上)があれば消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 100,
        floors: 1,
        undergroundFloors: 0,
        hazardousMaterials: {
          hasMinorHazardous: true,
          designatedQuantityRatio: 0.2, // 指定数量の1/5
        },
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-007')).toBe(true);
    });

    it('指定可燃物(規制数量以上)があれば消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 100,
        floors: 1,
        undergroundFloors: 0,
        designatedCombustibles: {
          hasCombustibles: true,
          regulatedQuantityRatio: 1.0,
        },
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-007-2')).toBe(true);
    });
  });

  describe('第5号 地階・3階以上で床面積50㎡以上', () => {
    it('地階で床面積50㎡以上なら消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-008')).toBe(true);
    });

    it('3階以上で床面積50㎡以上なら消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 50,
        floors: 3,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.some(r => r.ruleId === 'FE-009')).toBe(true);
    });

    it('2階で床面積50㎡以上でも消火器は不要(第1~4号該当なし)', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 50,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeUndefined();
    });
  });
});
