import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第25条 避難器具に関する基準のテスト
 */
describe('令第25条 避難器具', () => {
  describe('第1号 2階で収容人員20人以上', () => {
    it('特定用途の2階で収容人員20人以上なら避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 200,
        floors: 2,
        undergroundFloors: 0,
        capacity: 20,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeDefined();
      expect(evacuation?.isRequired).toBe(true);
      expect(evacuation?.appliedRules.some(r => r.ruleId === 'EV-001')).toBe(true);
    });

    it('2階でも収容人員19人なら避難器具は不要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 200,
        floors: 2,
        undergroundFloors: 0,
        capacity: 19,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeUndefined();
    });
  });

  describe('第2号 3階以上で収容人員10人以上', () => {
    it('特定用途の3階で収容人員10人以上なら避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 200,
        floors: 3,
        undergroundFloors: 0,
        capacity: 10,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeDefined();
      expect(evacuation?.isRequired).toBe(true);
      expect(evacuation?.appliedRules.some(r => r.ruleId === 'EV-002')).toBe(true);
    });

    it('5階で収容人員10人以上なら避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '5-i',
        totalArea: 200,
        floors: 5,
        undergroundFloors: 0,
        capacity: 10,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeDefined();
      expect(evacuation?.isRequired).toBe(true);
    });
  });

  describe('第3号 (六)ロは避難階以外の全ての階', () => {
    it('(六)ロの2階以上で人員不問で避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-ro-1',
        totalArea: 100,
        floors: 2,
        undergroundFloors: 0,
        capacity: 5,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeDefined();
      expect(evacuation?.isRequired).toBe(true);
      expect(evacuation?.appliedRules.some(r => r.ruleId === 'EV-003')).toBe(true);
    });
  });

  describe('第4号 地階で収容人員20人以上', () => {
    it('特定用途の地階で収容人員20人以上なら避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 200,
        floors: 1,
        undergroundFloors: 1,
        capacity: 20,
      };

      const result = judge(building);
      const evacuation = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '避難器具'
      );

      expect(evacuation).toBeDefined();
      expect(evacuation?.isRequired).toBe(true);
      expect(evacuation?.appliedRules.some(r => r.ruleId === 'EV-004')).toBe(true);
    });
  });
});
