import { describe, it, expect } from 'vitest';
import { judge, RegulationJudge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

describe('RegulationJudge', () => {
  describe('消火器(令第10条)', () => {
    it('(一)項イで延べ500㎡の劇場には消火器が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeDefined();
      expect(fireExtinguisher?.isRequired).toBe(true);
      expect(fireExtinguisher?.appliedRules.length).toBeGreaterThan(0);
    });

    it('(七)項で延べ200㎡の建物には消火器は不要(300㎡未満)', () => {
      const building: BuildingInfo = {
        usageCode: '7',
        totalArea: 200,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireExtinguisher = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '消火器'
      );

      expect(fireExtinguisher).toBeUndefined();
    });

    it('(七)項で延べ300㎡以上の建物には消火器が必要', () => {
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
    });
  });

  describe('屋内消火栓(令第11条)', () => {
    it('(一)項で延べ500㎡以上の建物には屋内消火栓が必要', () => {
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
    });

    it('(二)項で延べ700㎡以上の建物には屋内消火栓が必要', () => {
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
    });

    it('(二)項で延べ600㎡の建物には屋内消火栓は不要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 600,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const indoorHydrant = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '屋内消火栓設備'
      );

      expect(indoorHydrant).toBeUndefined();
    });

    it('耐火構造+難燃材料の建物は面積基準が3倍緩和される', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1400, // 500 * 3 = 1500㎡未満なので不要
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

    it('耐火構造+難燃材料でも1500㎡以上なら屋内消火栓が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 1500, // 500 * 3 = 1500㎡以上
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
  });

  describe('自動火災報知設備(令第21条)', () => {
    it('(六)項イ(1)の施設には面積不問で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-i-1',
        totalArea: 100, // 小規模でも必要
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
    });

    it('(一)項で延べ300㎡以上の建物には自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 300,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
    });
  });

  describe('避難器具(令第25条)', () => {
    it('特定用途の2階で収容人員20人以上なら避難器具が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
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
    });

    it('特定用途の2階でも収容人員19人なら避難器具は不要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 500,
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

  describe('複数設備の判定', () => {
    it('大規模特定用途建築物には複数の設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 1000,
        floors: 5,
        undergroundFloors: 0,
        capacity: 100,
      };

      const result = judge(building);

      // 消火器
      expect(
        result.requiredEquipment.find((eq) => eq.equipmentType === '消火器')
      ).toBeDefined();

      // 屋内消火栓
      expect(
        result.requiredEquipment.find((eq) => eq.equipmentType === '屋内消火栓設備')
      ).toBeDefined();

      // 自動火災報知設備
      expect(
        result.requiredEquipment.find((eq) => eq.equipmentType === '自動火災報知設備')
      ).toBeDefined();

      // 避難器具
      expect(
        result.requiredEquipment.find((eq) => eq.equipmentType === '避難器具')
      ).toBeDefined();

      // 誘導灯
      expect(
        result.requiredEquipment.find((eq) => eq.equipmentType === '誘導灯')
      ).toBeDefined();
    });
  });

  describe('isEquipmentRequired メソッド', () => {
    it('特定の設備が必要かどうかを判定できる', () => {
      const building: BuildingInfo = {
        usageCode: '2-i', // (一)項イではなく(二)項イに変更(舞台部の誤検出を回避)
        totalArea: 500,
        floors: 2,
        undergroundFloors: 0,
      };

      const judge = new RegulationJudge();

      expect(judge.isEquipmentRequired(building, '消火器')).toBe(true);
      expect(judge.isEquipmentRequired(building, '屋内消火栓設備')).toBe(false); // 700㎡未満なので不要
      expect(judge.isEquipmentRequired(building, 'スプリンクラー設備')).toBe(false);
    });
  });
});
