import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第29条の2 非常コンセント設備に関する基準のテスト
 */
describe('令第29条の2 非常コンセント設備', () => {
  it('11階以上の各階で非常コンセント設備が必要', () => {
    const building: BuildingInfo = {
      usageCode: '1-i',
      totalArea: 500,
      floors: 11,
      undergroundFloors: 0,
    };

    const result = judge(building);
    const emergencyOutlet = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '非常コンセント設備'
    );

    expect(emergencyOutlet).toBeDefined();
    expect(emergencyOutlet?.isRequired).toBe(true);
    expect(emergencyOutlet?.appliedRules.some(r => r.ruleId === 'EC-001')).toBe(true);
  });

  it('15階建てでも非常コンセント設備が必要', () => {
    const building: BuildingInfo = {
      usageCode: '15',
      totalArea: 200,
      floors: 15,
      undergroundFloors: 0,
    };

    const result = judge(building);
    const emergencyOutlet = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '非常コンセント設備'
    );

    expect(emergencyOutlet).toBeDefined();
    expect(emergencyOutlet?.isRequired).toBe(true);
  });

  it('10階建てなら非常コンセント設備は不要', () => {
    const building: BuildingInfo = {
      usageCode: '1-i',
      totalArea: 500,
      floors: 10,
      undergroundFloors: 0,
    };

    const result = judge(building);
    const emergencyOutlet = result.requiredEquipment.find(
      (eq) => eq.equipmentType === '非常コンセント設備'
    );

    expect(emergencyOutlet).toBeUndefined();
  });
});
