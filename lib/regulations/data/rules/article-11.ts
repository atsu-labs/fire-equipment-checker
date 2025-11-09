import type { InstallationRule } from '../../types';

/**
 * 屋内消火栓設備設置基準ルール (令第11条)
 * 
 * 令第11条第1項各号に基づく設置義務:
 * - 第1号: (一)項 延べ500㎡以上
 * - 第2号: (二)~(十)(十二)(十四)項 延べ700㎡以上
 * - 第3号: (十一)(十五)項 延べ1000㎡以上
 * - 第4号: (十六の二)項 延べ150㎡以上
 * - 第5号: 指定可燃物(可燃性液体類除く) 750倍以上
 * - 第6号: 地階・無窓階・4階以上で床面積基準
 * 
 * 【重要】令第11条第2項 面積基準の緩和規定について:
 * 以下の構造条件により面積基準が緩和されます(判定エンジン側で処理):
 * - 特定主要構造部が耐火構造 + 内装難燃材料 → 3倍緩和
 * - 特定主要構造部が耐火構造のみ → 2倍緩和
 * - 建築基準法2条9の3イ・ロ該当 + 内装難燃材料 → 2倍緩和
 * ※第2号については、次条(第12条)との連携による上限値あり
 * 
 * 令第11条第4項 他設備設置時の免除:
 * スプリンクラー等の設備を設置した場合、その有効範囲内は屋内消火栓不要
 * (判定エンジン側で処理)
 */
export const INDOOR_HYDRANT_RULES: InstallationRule[] = [
  // ========================================
  // 第1号 (一)項
  // ========================================
  {
    id: 'IH-001',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'area', operator: '>=', value: 500 },
    ],
    legalBasis: '令第11条第1項第1号',
    priority: 90,
    scope: '全域',
    notes: '(一)項で延べ500㎡以上',
  },
  {
    id: 'IH-001-RO',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-ro' },
      { type: 'area', operator: '>=', value: 500 },
    ],
    legalBasis: '令第11条第1項第1号',
    priority: 90,
    scope: '全域',
    notes: '(一)項で延べ500㎡以上',
  },

  // ========================================
  // 第2号 (二)~(十)(十二)(十四)項
  // ========================================
  {
    id: 'IH-002',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { 
        type: 'usage', 
        operator: 'in', 
        value: ['2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '5-ro', '6-i', '6-ro', '6-ha', '9-i', '10', '12', '14'] 
      },
      { type: 'area', operator: '>=', value: 700 },
    ],
    legalBasis: '令第11条第1項第2号',
    priority: 90,
    scope: '全域',
    notes: '(二)~(十)(十二)(十四)項で延べ700㎡以上',
  },

  // ========================================
  // 第3号 (十一)(十五)項
  // ========================================
  {
    id: 'IH-003',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['11', '15'] },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第11条第1項第3号',
    priority: 88,
    scope: '全域',
    notes: '(十一)(十五)項で延べ1000㎡以上',
  },

  // ========================================
  // 第4号 (十六の二)項 地下街
  // ========================================
  {
    id: 'IH-004',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-2' },
      { type: 'area', operator: '>=', value: 150 },
    ],
    legalBasis: '令第11条第1項第4号',
    priority: 95,
    scope: '全域',
    notes: '地下街で延べ150㎡以上',
  },

  // ========================================
  // 第5号 指定可燃物(可燃性液体類除く)750倍以上
  // ========================================
  {
    id: 'IH-005',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'designatedCombustibles', operator: '>=', value: 750 },
    ],
    legalBasis: '令第11条第1項第5号',
    priority: 100,
    scope: '貯蔵・取扱場所',
    notes: '指定可燃物(可燃性液体類除く)を規制数量の750倍以上貯蔵・取扱うもの',
  },

  // ========================================
  // 第6号 地階・無窓階・4階以上
  // ========================================
  {
    id: 'IH-005',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 100 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(一)項の地階・無窓階・4階以上で床面積100㎡以上',
  },
  {
    id: 'IH-006',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-ro' },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 100 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(一)項の地階・無窓階・4階以上で床面積100㎡以上',
  },
  {
    id: 'IH-007',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'area', operator: '>=', value: 100 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(一)項の地階・無窓階・4階以上で床面積100㎡以上',
  },
  {
    id: 'IH-008',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-ro' },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'area', operator: '>=', value: 100 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(一)項の地階・無窓階・4階以上で床面積100㎡以上',
  },
  {
    id: 'IH-009',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { 
        type: 'usage', 
        operator: 'in', 
        value: ['2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '5-ro', '6-i', '6-ro', '6-ha', '9-i', '10', '12', '14'] 
      },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 150 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(二)~(十)(十二)(十四)項の地階・無窓階・4階以上で床面積150㎡以上',
  },
  {
    id: 'IH-010',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { 
        type: 'usage', 
        operator: 'in', 
        value: ['2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '5-ro', '6-i', '6-ro', '6-ha', '9-i', '10', '12', '14'] 
      },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'area', operator: '>=', value: 150 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 88,
    scope: '地階・無窓階・4階以上',
    notes: '(二)~(十)(十二)(十四)項の地階・無窓階・4階以上で床面積150㎡以上',
  },
  {
    id: 'IH-011',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['11', '15'] },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 200 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 85,
    scope: '地階・無窓階・4階以上',
    notes: '(十一)(十五)項の地階・無窓階・4階以上で床面積200㎡以上',
  },
  {
    id: 'IH-012',
    equipmentType: '屋内消火栓設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['11', '15'] },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'area', operator: '>=', value: 200 },
    ],
    legalBasis: '令第11条第1項第6号',
    priority: 85,
    scope: '地階・無窓階・4階以上',
    notes: '(十一)(十五)項の地階・無窓階・4階以上で床面積200㎡以上',
  },
];

