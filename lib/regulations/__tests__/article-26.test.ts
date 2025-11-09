import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第26条 誘導灯に関する基準のテスト
 */
describe('令第26条 誘導灯', () => {
  it('特定用途で面積不問で誘導灯が必要', () => {
    const building: BuildingInfo = {
      usageCode: '1-i',
      totalArea: 50,
      floors: 1,
      undergroundFloors: 0,
    };

    const result = judge(building);
    const guideLight = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '誘導灯'
    );

    expect(guideLight).toBeDefined();
    expect(guideLight?.isRequired).toBe(true);
    expect(guideLight?.appliedRules.some(r => r.ruleId === 'GL-001')).toBe(true);
  });

  it('飲食店で面積不問で誘導灯が必要', () => {
    const building: BuildingInfo = {
      usageCode: '3-i',
      totalArea: 50,
      floors: 1,
      undergroundFloors: 0,
    };

    const result = judge(building);
    const guideLight = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '誘導灯'
    );

    expect(guideLight).toBeDefined();
    expect(guideLight?.isRequired).toBe(true);
  });

  it('地下街で面積不問で誘導灯が必要', () => {
    const building: BuildingInfo = {
      usageCode: '16-2',
      totalArea: 50,
      floors: 1,
      undergroundFloors: 1,
    };

    const result = judge(building);
    const guideLight = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '誘導灯'
    );

    expect(guideLight).toBeDefined();
    expect(guideLight?.isRequired).toBe(true);
  });
});
