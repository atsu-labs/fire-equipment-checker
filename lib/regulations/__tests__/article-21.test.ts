import { describe, it, expect } from 'vitest';
import { judge } from '../engine/regulation-judge';
import type { BuildingInfo } from '../types';

/**
 * 令第21条 自動火災報知設備に関する基準のテスト
 */
describe('令第21条 自動火災報知設備', () => {
  describe('第1号 常時設置が必要な用途', () => {
    it('(二)ニで面積不問で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-ni',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-001')).toBe(true);
    });

    it('(六)イ(1)で面積不問で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-i-1',
        totalArea: 50,
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

    it('(六)ハ(入居・宿泊型)で面積不問で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '6-ha-1',
        totalArea: 50,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-002')).toBe(true);
    });
  });

  describe('第2号 (九)イで200㎡以上', () => {
    it('(九)イで200㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '9-i',
        totalArea: 200,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-003')).toBe(true);
    });
  });

  describe('第3号 延べ300㎡以上', () => {
    it('(一)項イで300㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-004')).toBe(true);
    });

    it('(二)項イで300㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 300,
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

    it('地下街で300㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-2',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
    });
  });

  describe('第4号 延べ500㎡以上', () => {
    it('(五)ロで500㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '5-ro',
        totalArea: 500,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-006')).toBe(true);
    });

    it('(十四)で500㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '14',
        totalArea: 500,
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
  });

  describe('第5号 準地下街', () => {
    it('準地下街で500㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '16-3',
        totalArea: 500,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-007')).toBe(true);
    });
  });

  describe('第6号 工場・倉庫で1000㎡以上', () => {
    it('(十一)で1000㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 1000,
        floors: 1,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-008')).toBe(true);
    });

    it('(十五)で1000㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 1000,
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
  });

  describe('第7号 階段不足', () => {
    it('特定用途が避難階以外にあり直通階段2未満で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '1-i',
        totalArea: 200,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-009')).toBe(true);
    });
  });

  describe('第10号 飲食店・物販店の地階・無窓階', () => {
    it('(二)項イの地階で100㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '2-i',
        totalArea: 100,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-010')).toBe(true);
    });

    it('(三)項イの地階で100㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '3-i',
        totalArea: 100,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
    });
  });

  describe('第11号 地階・無窓階・3階以上で300㎡以上', () => {
    it('地階で300㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 300,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-011')).toBe(true);
    });

    it('3階以上で300㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '11',
        totalArea: 300,
        floors: 3,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-012')).toBe(true);
    });
  });

  describe('第13号 駐車場', () => {
    it('地階の駐車場で200㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '13-i',
        totalArea: 200,
        floors: 1,
        undergroundFloors: 1,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-013')).toBe(true);
    });

    it('2階以上の駐車場で200㎡以上なら自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '13-i',
        totalArea: 200,
        floors: 2,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-014')).toBe(true);
    });
  });

  describe('第14号 11階以上', () => {
    it('全防火対象物の11階以上で自動火災報知設備が必要', () => {
      const building: BuildingInfo = {
        usageCode: '15',
        totalArea: 100,
        floors: 11,
        undergroundFloors: 0,
      };

      const result = judge(building);
      const fireAlarm = result.requiredEquipment.find(
        (eq) => eq.equipmentType === '自動火災報知設備'
      );

      expect(fireAlarm).toBeDefined();
      expect(fireAlarm?.isRequired).toBe(true);
      expect(fireAlarm?.appliedRules.some(r => r.ruleId === 'FA-015')).toBe(true);
    });
  });
});
