/**
 * 第19条（屋外消火栓設備）のテスト
 */

import { describe, it, expect } from 'vitest';
import type { BuildingInfo } from '../types';
import { checkArticle19, checkArticle19_2 } from '../data/rules/article-19';

describe('第19条: 屋外消火栓設備', () => {
  describe('耐火建築物', () => {
    it('1階及び2階の床面積合計が9,000㎡以上の場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 20000,
        floors: 5,
        undergroundFloors: 0,
        structureType: 'fireproof',
        floorUsageDetails: [
          { floor: 1, usageCode: '15', area: 5000, isEvacuationFloor: true },
          { floor: 2, usageCode: '15', area: 4500 },
          { floor: 3, usageCode: '15', area: 3500 },
          { floor: 4, usageCode: '15', area: 3500 },
          { floor: 5, usageCode: '15', area: 3500 },
        ],
      };

      expect(checkArticle19(building)).toBe(true);
    });

    it('1階及び2階の床面積合計が9,000㎡未満の場合は非該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 15000,
        floors: 5,
        undergroundFloors: 0,
        structureType: 'fireproof',
        floorUsageDetails: [
          { floor: 1, usageCode: '15', area: 4000, isEvacuationFloor: true },
          { floor: 2, usageCode: '15', area: 4000 },
          { floor: 3, usageCode: '15', area: 2500 },
          { floor: 4, usageCode: '15', area: 2500 },
          { floor: 5, usageCode: '15', area: 2000 },
        ],
      };

      expect(checkArticle19(building)).toBe(false);
    });
  });

  describe('準耐火建築物', () => {
    it('1階及び2階の床面積合計が6,000㎡以上の場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 15000,
        floors: 5,
        undergroundFloors: 0,
        structureType: 'quasi-fireproof',
        floorUsageDetails: [
          { floor: 1, usageCode: '15', area: 3500, isEvacuationFloor: true },
          { floor: 2, usageCode: '15', area: 3000 },
          { floor: 3, usageCode: '15', area: 3000 },
          { floor: 4, usageCode: '15', area: 3000 },
          { floor: 5, usageCode: '15', area: 2500 },
        ],
      };

      expect(checkArticle19(building)).toBe(true);
    });
  });

  describe('その他の建築物', () => {
    it('1階及び2階の床面積合計が3,000㎡以上の場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 8000,
        floors: 4,
        undergroundFloors: 0,
        structureType: 'other',
        floorUsageDetails: [
          { floor: 1, usageCode: '15', area: 1800, isEvacuationFloor: true },
          { floor: 2, usageCode: '15', area: 1500 },
          { floor: 3, usageCode: '15', area: 2500 },
          { floor: 4, usageCode: '15', area: 2200 },
        ],
      };

      expect(checkArticle19(building)).toBe(true);
    });
  });

  describe('2項: 同一敷地内の複数建築物', () => {
    it('1階3m以下、2階5m以下の距離にある建築物は結合すべき', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 5000,
        floors: 3,
        undergroundFloors: 0,
        adjacentBuildings: [
          {
            buildingId: 'building-002',
            floor1ExteriorWallDistance: 2.5,
            floor2ExteriorWallDistance: 4.5,
          },
        ],
      };

      const result = checkArticle19_2(building);
      expect(result.shouldCombine).toBe(true);
      expect(result.combinedBuildings).toContain('building-002');
    });

    it('基準を超える距離の場合は結合しない', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 5000,
        floors: 3,
        undergroundFloors: 0,
        adjacentBuildings: [
          {
            buildingId: 'building-003',
            floor1ExteriorWallDistance: 4.0,
            floor2ExteriorWallDistance: 6.0,
          },
        ],
      };

      const result = checkArticle19_2(building);
      expect(result.shouldCombine).toBe(false);
    });
  });
});
