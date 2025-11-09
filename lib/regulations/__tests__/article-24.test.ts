/**
 * 第24条（非常警報器具）のテスト
 */

import { describe, it, expect } from 'vitest';
import type { BuildingInfo } from '../types';
import { checkArticle24 } from '../data/rules/article-24';

describe('第24条: 非常警報器具又は非常ベル', () => {
  it('収容人員20人未満の場合は不要', () => {
    const building: BuildingInfo = {
      usageCode: '6-ro-1',
      totalArea: 500,
      floors: 2,
      undergroundFloors: 0,
      capacity: 15,
    };

    const result = checkArticle24(building);
    expect(result.required).toBe(false);
  });

  it('収容人員20人以上50人未満の場合は非常警報器具が必要', () => {
    const building: BuildingInfo = {
      usageCode: '6-ro-1',
      totalArea: 800,
      floors: 2,
      undergroundFloors: 0,
      capacity: 35,
    };

    const result = checkArticle24(building);
    expect(result.required).toBe(true);
    expect(result.alarmType).toBe('非常警報器具');
  });

  it('収容人員50人以上の場合は非常ベルが必要', () => {
    const building: BuildingInfo = {
      usageCode: '6-ro-1',
      totalArea: 1500,
      floors: 3,
      undergroundFloors: 0,
      capacity: 80,
    };

    const result = checkArticle24(building);
    expect(result.required).toBe(true);
    expect(result.alarmType).toBe('非常ベル');
  });

  it('特定用途で収容人員300人以上の場合は放送設備が必要', () => {
    const building: BuildingInfo = {
      usageCode: '6-ro-1',
      totalArea: 5000,
      floors: 5,
      undergroundFloors: 0,
      capacity: 350,
    };

    const result = checkArticle24(building);
    expect(result.required).toBe(true);
    expect(result.alarmType).toBe('放送設備');
  });

  it('収容人員800人以上の場合はすべての用途で放送設備が必要', () => {
    const building: BuildingInfo = {
      usageCode: '15',
      totalArea: 15000,
      floors: 10,
      undergroundFloors: 0,
      capacity: 900,
    };

    const result = checkArticle24(building);
    expect(result.required).toBe(true);
    expect(result.alarmType).toBe('放送設備');
  });
});
