import type { InstallationRule } from '../../types';

/**
 * 自動火災報知設備設置基準ルール (令第21条)
 */
export const FIRE_ALARM_RULES: InstallationRule[] = [
  // 第1号 常時設置
  {
    id: 'FA-001',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['2-ni', '5-i', '6-i-1', '6-i-2', '6-i-3', '6-ro', '13-ro', '17'] },
    ],
    legalBasis: '令第21条第1項第1号イ',
    priority: 100,
    scope: '全域',
    notes: '(二)ニ、(五)イ、(六)イ(1)~(3)及びロ、(十三)ロ、(十七)(面積不問)',
  },
  {
    id: 'FA-002',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5'] },
    ],
    legalBasis: '令第21条第1項第1号ロ',
    priority: 100,
    scope: '全域',
    notes: '(六)ハ(入居・宿泊型のみ)',
  },

  // 第2号 (九)イ
  {
    id: 'FA-003',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: '==', value: '9-i' },
      { type: 'area', operator: '>=', value: 200 },
    ],
    legalBasis: '令第21条第1項第2号',
    priority: 95,
    scope: '全域',
    notes: '(九)イで延べ200㎡以上',
  },

  // 第3号 延べ300㎡以上
  {
    id: 'FA-004',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4', '6-i-4', '6-ni', '16-i', '16-2'] },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第21条第1項第3号イ',
    priority: 90,
    scope: '全域',
    notes: '(一)(二)イ~ハ(三)(四)(六)イ(4)及びニ、(十六)イ、(十六の二)で300㎡以上',
  },
  {
    id: 'FA-005',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5'] },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第21条第1項第3号ロ',
    priority: 90,
    scope: '全域',
    notes: '(六)ハ(入居・宿泊除く)で300㎡以上',
  },

  // 第4号 延べ500㎡以上
  {
    id: 'FA-006',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['5-ro', '7', '8', '9-ro', '10', '12', '13-i', '14'] },
      { type: 'area', operator: '>=', value: 500 },
    ],
    legalBasis: '令第21条第1項第4号',
    priority: 88,
    scope: '全域',
    notes: '(五)ロ、(七)~(十)(十二)(十三)イ(十四)で500㎡以上',
  },

  // 第5号 準地下街
  {
    id: 'FA-007',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: '==', value: '16-3' },
      { type: 'area', operator: '>=', value: 500 },
    ],
    legalBasis: '令第21条第1項第5号',
    priority: 92,
    scope: '特定用途部分(300㎡以上)',
    notes: '準地下街で延べ500㎡以上かつ特定用途300㎡以上',
  },

  // 第6号 (十一)(十五)
  {
    id: 'FA-008',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['11', '15'] },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第21条第1項第6号',
    priority: 85,
    scope: '全域',
    notes: '工場・倉庫で延べ1000㎡以上',
  },

  // 第7号 階段不足
  {
    id: 'FA-009',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4', '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5', '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '9-i'] },
      { type: 'floors', operator: '>=', value: 2 },
    ],
    legalBasis: '令第21条第1項第7号',
    priority: 93,
    scope: '避難階以外の階',
    notes: '特定用途が避難階以外にあり直通階段2未満(屋外等の場合1未満)',
  },

  // 第10号 飲食店・物販店の地階・無窓階
  {
    id: 'FA-010',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'usage', operator: 'in', value: ['2-i', '2-ro', '2-ha', '3-i', '3-ro'] },
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 100 },
    ],
    legalBasis: '令第21条第1項第10号',
    priority: 90,
    scope: '該当階',
    notes: '(二)イ~ハ(三)の地階・無窓階で100㎡以上',
  },

  // 第11号 地階・無窓階・3階以上
  {
    id: 'FA-011',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第21条第1項第11号',
    priority: 85,
    scope: '該当階',
    notes: '地階・無窓階で300㎡以上',
  },
  {
    id: 'FA-012',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'floors', operator: '>=', value: 3 },
      { type: 'area', operator: '>=', value: 300 },
    ],
    legalBasis: '令第21条第1項第11号',
    priority: 85,
    scope: '該当階',
    notes: '3階以上で300㎡以上',
  },

  // 第13号 駐車場
  {
    id: 'FA-013',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 200 },
    ],
    legalBasis: '令第21条第1項第13号',
    priority: 88,
    scope: '駐車部分',
    notes: '地階・2階以上の駐車場で200㎡以上',
  },
  {
    id: 'FA-014',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'floors', operator: '>=', value: 2 },
      { type: 'area', operator: '>=', value: 200 },
    ],
    legalBasis: '令第21条第1項第13号',
    priority: 88,
    scope: '駐車部分',
    notes: '地階・2階以上の駐車場で200㎡以上',
  },

  // 第14号 11階以上
  {
    id: 'FA-015',
    equipmentType: '自動火災報知設備',
    conditions: [
      { type: 'floors', operator: '>=', value: 11 },
    ],
    legalBasis: '令第21条第1項第14号',
    priority: 95,
    scope: '11階以上',
    notes: '全防火対象物の11階以上',
  },
];
