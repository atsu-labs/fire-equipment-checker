import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第12条 スプリンクラー設備に関する基準のテスト
 */
describe('令第12条 スプリンクラー設備', () => {
  describe('第1号 (六)項施設', () => {
    it('助産施設で面積不問でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-i-1',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-001')).toBe(true);
    });

    it('障害児入所施設で面積不問でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-ro-1',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-002')).toBe(true);
    });

    it('特別養護老人ホームで275㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-ro-2',
        totalArea: 275,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-003')).toBe(true);
    });
  });

  describe('第2号 舞台部', () => {
    it('劇場の地階舞台部300㎡以上でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-004')).toBe(true);
    });

    it('劇場の4階以上舞台部300㎡以上でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 300,
        floors: 4,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-005')).toBe(true);
    });

    it('劇場のその他の階舞台部500㎡以上でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-006')).toBe(true);
    });
  });

  describe('第3号 11階建以上', () => {
    it('特定用途で11階建以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1000,
        floors: 11,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-007')).toBe(true);
    });

    it('飲食店で11階建以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '3-i',
        totalArea: 1000,
        floors: 11,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
    });
  });

  describe('第4号 大規模建物', () => {
    it('(四)項で平屋建以外、3000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '4',
        totalArea: 3000,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-008')).toBe(true);
    });

    it('劇場で平屋建以外、6000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 6000,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-009')).toBe(true);
    });
  });

  describe('第5号 ラック式倉庫', () => {
    it('ラック式倉庫で700㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '14',
        totalArea: 700,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-010')).toBe(true);
    });
  });

  describe('第6号 地下街', () => {
    it('地下街で1000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-2',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-011')).toBe(true);
    });
  });

  describe('第7号 準地下街', () => {
    it('準地下街で1000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-3',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-012')).toBe(true);
    });
  });

  describe('第9号 地下街内の福祉施設', () => {
    it('地下街内で1000㎡未満でも(六)項用途ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-2',
        totalArea: 500,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-013')).toBe(true);
    });
  });

  describe('第10号 複合建物内の特定用途', () => {
    it('複合用途で特定用途部分3000㎡以上の階でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-i',
        totalArea: 3000,
        floors: 5,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-014')).toBe(true);
    });
  });

  describe('第11号 地階・無窓階・4~10階', () => {
    it('(一)項の地階で1000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-015')).toBe(true);
    });

    it('(三)項の4~10階で1500㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '3-i',
        totalArea: 1500,
        floors: 5,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-016')).toBe(true);
    });

    it('(二)項の地階・無窓階・4~10階で1000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 1000,
        floors: 5,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-017')).toBe(true);
    });

    it('複合用途の地階で特定用途部分1000㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-i',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-018')).toBe(true);
    });

    it('複合用途の4~10階で特定用途部分1500㎡以上ならスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-i',
        totalArea: 1500,
        floors: 5,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-019')).toBe(true);
    });
  });

  describe('第12号 11階以上', () => {
    it('全ての防火対象物の11階以上でスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 500,
        floors: 11,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
      expect(sprinkler?.appliedRules.some(r => r.ruleId === 'SP-020')).toBe(true);
    });

    it('倉庫の11階以上でもスプリンクラーが必要', () => {
      const building: BuildingInfo = {
        usageCode: '14',
        totalArea: 200,
        floors: 11,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const sprinkler = result.requiredEquipment.find(
        (eq) => eq.equipmentType === 'スプリンクラー設備'
      );

      expect(sprinkler).toBeDefined();
      expect(sprinkler?.isRequired).toBe(true);
    });
  });
});
