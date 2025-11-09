import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第11条 屋内消火栓設備に関する基準のテスト
 */
describe('令第11条 屋内消火栓設備', () => {
  describe('第1号 (一)項で延べ500㎡以上', () => {
    it('(一)項イで延べ500㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-001')).toBe(true);
    });

    it('(一)項イで延べ499㎡なら屋内消火栓は不要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 499,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });

    it('(一)項ロでも延べ500㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-ro',
        totalArea: 500,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });
  });

  describe('第2号 (二)~(十)(十二)(十四)項で延べ700㎡以上', () => {
    it('(二)項イで延べ700㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 700,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-002')).toBe(true);
    });

    it('(二)項イで延べ699㎡なら屋内消火栓は不要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 699,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });

    it('(四)項で延べ700㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '4',
        totalArea: 700,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });
  });

  describe('第3号 (十一)(十五)項で延べ1000㎡以上', () => {
    it('(十一)項で延べ1000㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-003')).toBe(true);
    });

    it('(十一)項で延べ999㎡なら屋内消火栓は不要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 999,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });
  });

  describe('第4号 (十六の二)項で延べ150㎡以上', () => {
    it('地下街で延べ150㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-2',
        totalArea: 150,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-004')).toBe(true);
    });
  });

  describe('第5号 指定可燃物750倍以上', () => {
    it('指定可燃物750倍以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 500,
        floors: 1,
        undergroundFloors: 0,
        designatedCombustibles: {
          hasCombustibles: true,
          regulatedQuantityRatio: 750,
        },
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-005')).toBe(true);
    });
  });

  describe('第6号 地階・4階以上で床面積基準', () => {
    it('(一)項の地階で床面積100㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 100,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
      expect(indoorHydrant?.appliedRules.some(r => r.ruleId === 'IH-005')).toBe(true);
    });

    it('(一)項の4階以上で床面積100㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 100,
        floors: 4,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });

    it('(二)項の地階で床面積150㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 150,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });

    it('(十一)項の4階以上で床面積200㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 200,
        floors: 4,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });
  });

  describe('第2項 面積基準の緩和', () => {
    it('特定主要構造部が耐火構造+内装難燃材料なら3倍緩和', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1400, // 500 * 3 = 1500未満
        floors: 2,
        undergroundFloors: 0,
        structureDetails: {
          specialMainStructureFireproof: true,
          wallInteriorFinish: 'flame-retardant',
          ceilingInteriorFinish: 'flame-retardant',
        },
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });

    it('特定主要構造部が耐火構造+内装難燃材料でも1500㎡以上なら必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1500, // 500 * 3 = 1500
        floors: 2,
        undergroundFloors: 0,
        structureDetails: {
          specialMainStructureFireproof: true,
          wallInteriorFinish: 'flame-retardant',
          ceilingInteriorFinish: 'flame-retardant',
        },
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeDefined();
      expect(indoorHydrant?.isRequired).toBe(true);
    });

    it('特定主要構造部が耐火構造のみなら2倍緩和', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 900, // 500 * 2 = 1000未満
        floors: 2,
        undergroundFloors: 0,
        structureDetails: {
          specialMainStructureFireproof: true,
        },
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });

    it('建築基準法2条9の3該当+内装難燃材料なら2倍緩和', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 1300, // 700 * 2 = 1400未満
        floors: 2,
        undergroundFloors: 0,
        structureDetails: {
          qualifiesForBCL2_9_3: true,
          wallInteriorFinish: 'flame-retardant',
          ceilingInteriorFinish: 'flame-retardant',
        },
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });
  });
});
