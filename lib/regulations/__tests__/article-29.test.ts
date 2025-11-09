import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第29条 連結送水管に関する基準のテスト
 */
describe('令第29条 連結送水管', () => {
  describe('第1号 7階以上の建物', () => {
    it('7階以上の建物で連結送水管が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
        floors: 7,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const standpipe = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '連結送水管'
      );

      expect(standpipe).toBeDefined();
      expect(standpipe?.isRequired).toBe(true);
      expect(standpipe?.appliedRules.some(r => r.ruleId === 'CS-001')).toBe(true);
    });

    it('10階建でも連結送水管が必要', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 300,
        floors: 10,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const standpipe = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '連結送水管'
      );

      expect(standpipe).toBeDefined();
      expect(standpipe?.isRequired).toBe(true);
    });

    it('6階建てなら連結送水管は不要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
        floors: 6,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const standpipe = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '連結送水管'
      );

      expect(standpipe).toBeUndefined();
    });
  });

  describe('第2号 地階で床面積1000㎡以上', () => {
    it('地階で1000㎡以上なら連結送水管が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const standpipe = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '連結送水管'
      );

      expect(standpipe).toBeDefined();
      expect(standpipe?.isRequired).toBe(true);
      expect(standpipe?.appliedRules.some(r => r.ruleId === 'CS-002')).toBe(true);
    });

    it('地階で999㎡なら連結送水管は不要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 999,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const standpipe = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '連結送水管'
      );

      expect(standpipe).toBeUndefined();
    });
  });
});
