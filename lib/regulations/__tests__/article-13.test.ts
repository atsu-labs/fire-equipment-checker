/**
 * 第13条（水噴霧消火設備等）のテスト
 */

import { describe, it, expect } from 'vitest';
import type { BuildingInfo } from '../types';
import {
  checkArticle13_1,
  checkArticle13_2,
  checkArticle13_3_i,
  checkArticle13_3_ro,
  checkArticle13_3_ha,
  checkArticle13_4,
  checkArticle13_5,
  checkArticle13_6,
  checkArticle13,
} from '../data/rules/article-13';

describe('第13条: 水噴霧消火設備等', () => {
  describe('1号: ヘリポート', () => {
    it('屋上に600㎡以上のヘリポートがある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '12-i',
        totalArea: 5000,
        floors: 5,
        undergroundFloors: 0,
        specificAreas: {
          hasHeliportRooftop600sqmOrMore: true,
        },
      };

      const result = checkArticle13_1(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('泡消火設備');
    });

    it('ヘリポートがない場合は非該当', () => {
      const building: BuildingInfo = {
        usageCode: '12-i',
        totalArea: 5000,
        floors: 5,
        undergroundFloors: 0,
      };

      const result = checkArticle13_1(building);
      expect(result.required).toBe(false);
    });
  });

  describe('2号: 道路用部分', () => {
    it('屋上に600㎡以上の道路用部分がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '4',
        totalArea: 5000,
        floors: 3,
        undergroundFloors: 0,
        specificAreas: {
          roadVehicleUse: {
            rooftop600sqmOrMore: true,
          },
        },
      };

      const result = checkArticle13_2(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('泡消火設備');
    });
  });

  describe('3号イ: 自動車修理・整備用部分', () => {
    it('地階に200㎡以上の自動車修理用部分がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 3000,
        floors: 2,
        undergroundFloors: 1,
        specificAreas: {
          autoRepair: {
            basementOr2ndFloorPlus200sqm: true,
          },
        },
      };

      const result = checkArticle13_3_i(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('泡消火設備');
    });
  });

  describe('3号ロ: 駐車用部分', () => {
    it('地階に200㎡以上の駐車場があり、全車両同時退出不可の場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 3000,
        floors: 2,
        undergroundFloors: 1,
        specificAreas: {
          parking: {
            basementOr2ndFloorPlus200sqm: true,
            canAllVehiclesExitSimultaneously: false,
          },
        },
      };

      const result = checkArticle13_3_ro(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('泡消火設備');
    });

    it('全車両が同時に退出できる場合は非該当', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 3000,
        floors: 2,
        undergroundFloors: 1,
        specificAreas: {
          parking: {
            basementOr2ndFloorPlus200sqm: true,
            canAllVehiclesExitSimultaneously: true,
          },
        },
      };

      const result = checkArticle13_3_ro(building);
      expect(result.required).toBe(false);
    });
  });

  describe('3号ハ: 機械式駐車場', () => {
    it('収容台数10台以上の機械式駐車場がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 2000,
        floors: 3,
        undergroundFloors: 0,
        specificAreas: {
          hasMechanicalParking10OrMore: true,
        },
      };

      const result = checkArticle13_3_ha(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('泡消火設備');
      expect(result.applicableEquipment).toContain('不活性ガス消火設備');
    });
  });

  describe('4号: 電気設備室', () => {
    it('200㎡以上の電気設備室がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 5000,
        floors: 5,
        undergroundFloors: 0,
        specificAreas: {
          hasElectricalRoom200sqmOrMore: true,
        },
      };

      const result = checkArticle13_4(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('不活性ガス消火設備');
      expect(result.applicableEquipment).toContain('ハロゲン化物消火設備');
    });
  });

  describe('5号: 多量火気使用部分', () => {
    it('200㎡以上の多量火気使用部分がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 5000,
        floors: 3,
        undergroundFloors: 0,
        specificAreas: {
          hasHighFireUse200sqmOrMore: true,
        },
      };

      const result = checkArticle13_5(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('粉末消火設備');
    });
  });

  describe('6号: 通信機器室', () => {
    it('500㎡以上の通信機器室がある場合は該当', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 8000,
        floors: 10,
        undergroundFloors: 0,
        specificAreas: {
          hasCommunicationRoom500sqmOrMore: true,
        },
      };

      const result = checkArticle13_6(building);
      expect(result.required).toBe(true);
      expect(result.applicableEquipment).toContain('不活性ガス消火設備');
    });
  });

  describe('統合判定', () => {
    it('複数の号に該当する場合、すべての結果を返す', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 10000,
        floors: 8,
        undergroundFloors: 0,
        specificAreas: {
          hasCommunicationRoom500sqmOrMore: true,
          hasElectricalRoom200sqmOrMore: true,
        },
      };

      const results = checkArticle13(building);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.required)).toBe(true);
    });
  });
});
