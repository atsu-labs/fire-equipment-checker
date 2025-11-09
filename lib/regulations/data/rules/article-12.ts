import type { InstallationRule } from '../../types';

/**
 * スプリンクラー設備設置基準ルール (令第12条)
 */
export const SPRINKLER_RULES: InstallationRule[] = [
  // 第1号 (六)項施設
  {
    id: 'SP-001',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-i-1', '6-i-2'] },
    ],
    legalBasis: '令第12条第1項第1号イ',
    priority: 100,
    scope: '全域',
    notes: '助産施設・乳児院(面積不問)',
  },
  {
    id: 'SP-002',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-ro-1', '6-ro-3'] },
    ],
    legalBasis: '令第12条第1項第1号ロ',
    priority: 100,
    scope: '全域',
    notes: '障害児入所施設・児童心理治療施設(面積不問)',
  },
  {
    id: 'SP-003',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-ro-2', '6-ro-4', '6-ro-5'] },
      { type: 'area', operator: '>=', value: 275 },
    ],
    legalBasis: '令第12条第1項第1号ハ',
    priority: 100,
    scope: '全域',
    notes: '特養・有料老人ホーム等で275㎡以上(介助必要者主対象外は除外条件あり)',
  },

  // 第2号 舞台部
  {
    id: 'SP-004',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第12条第1項第2号',
    priority: 95,
    scope: '舞台部',
    notes: '劇場等の舞台部が地階・無窓階・4階以上で300㎡以上',
  },
  {
    id: 'SP-005',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第12条第1項第2号',
    priority: 95,
    scope: '舞台部',
    notes: '劇場等の舞台部が地階・無窓階・4階以上で300㎡以上',
  },
  {
    id: 'SP-006',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '1-i' },
      { type: 'area', operator: '>=', value: 500 },
    ],
    legalBasis: '令第12条第1項第2号',
    priority: 92,
    scope: '舞台部',
    notes: '劇場等の舞台部がその他の階で500㎡以上',
  },

  // 第3号 11階建以上
  {
    id: 'SP-007',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '6-i', '6-ro', '6-ha', '9-i', '16-i'] },
      { type: 'floors', operator: '>=', value: 11 },
    ],
    legalBasis: '令第12条第1項第3号',
    priority: 98,
    scope: '全域(総務省令で定める部分除く)',
    notes: '特定用途で11階建以上',
  },

  // 第4号 大規模建物
  {
    id: 'SP-008',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['4', '6-i-1', '6-i-2', '6-i-3'] },
      { type: 'floors', operator: '>=', value: 2 },
      { type: 'area', operator: '>=', value: 3000 },
    ],
    legalBasis: '令第12条第1項第4号',
    priority: 92,
    scope: '全域(総務省令で定める部分除く)',
    notes: '(四)項・(六)項イ(1)~(3)で平屋建以外、3000㎡以上',
  },
  {
    id: 'SP-009',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '5-i', '6-ro', '9-i'] },
      { type: 'floors', operator: '>=', value: 2 },
      { type: 'area', operator: '>=', value: 6000 },
    ],
    legalBasis: '令第12条第1項第4号',
    priority: 88,
    scope: '全域(総務省令で定める部分除く)',
    notes: 'その他特定用途で平屋建以外、6000㎡以上',
  },

  // 第5号 ラック式倉庫
  {
    id: 'SP-010',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '14' },
      { type: 'area', operator: '>=', value: 700 },
    ],
    legalBasis: '令第12条第1項第5号',
    priority: 90,
    scope: '全域',
    notes: 'ラック式倉庫(天井高10m超)で延べ700㎡以上',
  },

  // 第6号 地下街
  {
    id: 'SP-011',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-2' },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第12条第1項第6号',
    priority: 95,
    scope: '全域',
    notes: '地下街で延べ1000㎡以上',
  },

  // 第7号 準地下街
  {
    id: 'SP-012',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-3' },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第12条第1項第7号',
    priority: 95,
    scope: '特定用途部分(500㎡以上)',
    notes: '準地下街で延べ1000㎡以上かつ特定用途500㎡以上',
  },

  // 第9号 地下街内の福祉施設
  {
    id: 'SP-013',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-2' },
      { type: 'area', operator: '<', value: 1000 },
    ],
    legalBasis: '令第12条第1項第9号',
    priority: 100,
    scope: '(六)項用途部分',
    notes: '地下街内の(六)項イ(1)(2)またはロ施設',
  },

  // 第10号 複合建物内の特定用途
  {
    id: 'SP-014',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-i' },
      { type: 'floors', operator: '<', value: 11 },
      { type: 'area', operator: '>=', value: 3000 },
    ],
    legalBasis: '令第12条第1項第10号',
    priority: 90,
    scope: '特定用途部分が存する階',
    notes: '複合用途で特定用途部分3000㎡以上の階',
  },

  // 第11号 地階・無窓階・4~10階
  {
    id: 'SP-015',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '3-i', '3-ro', '5-i', '6-i', '6-ro', '6-ha', '9-i'] },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第12条第1項第11号イ',
    priority: 88,
    scope: '該当階',
    notes: '(一)(三)(五)イ(六)(九)イの地階・無窓階で1000㎡以上',
  },
  {
    id: 'SP-016',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '3-i', '3-ro', '5-i', '6-i', '6-ro', '6-ha', '9-i'] },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'floors', operator: '<=', value: 10 },
      { type: 'area', operator: '>=', value: 1500 },
    ],
    legalBasis: '令第12条第1項第11号イ',
    priority: 86,
    scope: '該当階',
    notes: '(一)(三)(五)イ(六)(九)イの4~10階で1500㎡以上',
  },
  {
    id: 'SP-017',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['2-i', '2-ro', '2-ha', '2-ni', '4'] },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第12条第1項第11号ロ',
    priority: 87,
    scope: '該当階',
    notes: '(二)(四)項の地階・無窓階・4~10階で1000㎡以上',
  },
  {
    id: 'SP-018',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-i' },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第12条第1項第11号ハ',
    priority: 88,
    scope: '特定用途部分',
    notes: '複合用途の地階・無窓階で特定用途部分1000㎡以上',
  },
  {
    id: 'SP-019',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-i' },
      { type: 'floors', operator: '>=', value: 4 },
      { type: 'floors', operator: '<=', value: 10 },
      { type: 'area', operator: '>=', value: 1500 },
    ],
    legalBasis: '令第12条第1項第11号ハ',
    priority: 86,
    scope: '特定用途部分',
    notes: '複合用途の4~10階で特定用途部分1500㎡以上((二)(四)は1000㎡)',
  },

  // 第12号 11階以上
  {
    id: 'SP-020',
    equipmentType: 'スプリンクラー設備',
    conditions: [
      { type: 'floors', operator: '>=', value: 11 },
    ],
    legalBasis: '令第12条第1項第12号',
    priority: 95,
    scope: '11階以上の階',
    notes: '全ての防火対象物の11階以上',
  },
];
