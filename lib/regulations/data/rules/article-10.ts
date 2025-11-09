import type { InstallationRule } from '../../types';

/**
 * 消火器具の設置基準(令第10条)
 * 
 * 令第10条第1項各号に基づく設置義務の詳細:
 * - 第1号: 面積不問で設置義務あり
 * - 第2号: 延べ面積150㎡以上
 * - 第3号: 延べ面積300㎡以上
 * - 第4号: 少量危険物・指定可燃物の貯蔵取扱い
 * - 第5号: 地階・無窓階・3階以上で床面積50㎡以上
 */
export const FIRE_EXTINGUISHER_RULES: InstallationRule[] = [
  // ========================================
  // 第1号イ 面積不問
  // ========================================
  {
    id: 'FE-001',
    equipmentType: '消火器',
    conditions: [
      { 
        type: 'usage', 
        operator: 'in', 
        value: ['1-i', '2-i', '2-ro', '2-ha', '2-ni', '6-i-1', '6-i-2', '6-i-3', '6-ro', '16-2', '16-3', '17', '20'] 
      },
    ],
    legalBasis: '令第10条第1項第1号イ',
    priority: 100,
    scope: '全域',
    notes: '(一)イ、(二)、(六)イ(1)~(3)及びロ、(十六の二)~(十七)、(二十)(面積不問)',
  },

  // ========================================
  // 第1号ロ (三)項で火を使用する設備あり
  // ========================================
  {
    id: 'FE-002',
    equipmentType: '消火器',
    conditions: [
      { type: 'usage', operator: '==', value: '3-i' },
      { type: 'area', operator: '>=', value: 0 },
    ],
    legalBasis: '令第10条第1項第1号ロ',
    priority: 100,
    scope: '全域',
    notes: '(三)項で火を使用する設備・器具を設けたもの(面積不問)',
  },
  {
    id: 'FE-003',
    equipmentType: '消火器',
    conditions: [
      { type: 'usage', operator: '==', value: '3-ro' },
      { type: 'area', operator: '>=', value: 0 },
    ],
    legalBasis: '令第10条第1項第1号ロ',
    priority: 100,
    scope: '全域',
    notes: '(三)項で火を使用する設備・器具を設けたもの(面積不問)',
  },

  // ========================================
  // 第2号イ 延べ面積150㎡以上
  // ========================================
  {
    id: 'FE-004',
    equipmentType: '消火器',
    conditions: [
      { 
        type: 'usage', 
        operator: 'in', 
        value: ['1-ro', '4', '5-i', '5-ro', '6-i-4', '6-ha', '6-ni', '9-i', '9-ro', '12', '13-i', '13-ro', '14'] 
      },
      { type: 'area', operator: '>=', value: 150 },
    ],
    legalBasis: '令第10条第1項第2号イ',
    priority: 95,
    scope: '全域',
    notes: '(一)ロ、(四)、(五)、(六)イ(4)・ハ・ニ、(九)、(十二)~(十四)で延べ150㎡以上',
  },

  // ========================================
  // 第2号ロ (三)項(第1号ロ除く)で延べ150㎡以上
  // ========================================
  {
    id: 'FE-005',
    equipmentType: '消火器',
    conditions: [
      { type: 'usage', operator: 'in', value: ['3-i', '3-ro'] },
      { type: 'area', operator: '>=', value: 150 },
    ],
    legalBasis: '令第10条第1項第2号ロ',
    priority: 90,
    scope: '全域',
    notes: '(三)項(火を使用しない設備)で延べ150㎡以上',
  },

  // ========================================
  // 第3号 延べ面積300㎡以上
  // ========================================
  {
    id: 'FE-006',
    equipmentType: '消火器',
    conditions: [
      { type: 'usage', operator: 'in', value: ['7', '8', '10', '11', '15'] },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第10条第1項第3号',
    priority: 88,
    scope: '全域',
    notes: '(七)、(八)、(十)、(十一)、(十五)で延べ300㎡以上',
  },

  // ========================================
  // 第4号 少量危険物・指定可燃物
  // ========================================
  {
    id: 'FE-007',
    equipmentType: '消火器',
    conditions: [
      { type: 'hazardousMaterials', operator: '>=', value: 0.2 }, // 指定数量の1/5以上
    ],
    legalBasis: '令第10条第1項第4号',
    priority: 100,
    scope: '貯蔵・取扱場所',
    notes: '少量危険物(指定数量1/5以上1未満)を貯蔵・取扱うもの',
  },
  {
    id: 'FE-007-2',
    equipmentType: '消火器',
    conditions: [
      { type: 'designatedCombustibles', operator: '>=', value: 1 }, // 規制数量以上
    ],
    legalBasis: '令第10条第1項第4号',
    priority: 100,
    scope: '貯蔵・取扱場所',
    notes: '指定可燃物(規制数量以上)を貯蔵・取扱うもの',
  },

  // ========================================
  // 第5号 地階・無窓階・3階以上で床面積50㎡以上
  // ========================================
  {
    id: 'FE-008',
    equipmentType: '消火器',
    conditions: [
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 50 },
    ],
    legalBasis: '令第10条第1項第5号',
    priority: 85,
    scope: '地階',
    notes: '第1~4号以外の防火対象物の地階で床面積50㎡以上',
  },
  {
    id: 'FE-009',
    equipmentType: '消火器',
    conditions: [
      { type: 'floors', operator: '>=', value: 3 },
      { type: 'area', operator: '>=', value: 50 },
    ],
    legalBasis: '令第10条第1項第5号',
    priority: 85,
    scope: '3階以上',
    notes: '第1~4号以外の防火対象物の3階以上で床面積50㎡以上',
  },
];

