import type { InstallationRule } from '../../types';

/**
 * 連結送水管設置基準ルール (令第29条)
 */
export const STANDPIPE_RULES: InstallationRule[] = [
  {
    id: 'CS-001',
    equipmentType: '連結送水管',
    conditions: [
      { type: 'floors', operator: '>=', value: 7 },
    ],
    legalBasis: '令第29条第1項第1号',
    priority: 90,
    scope: '全域',
    notes: '7階以上の建物',
  },
  {
    id: 'CS-002',
    equipmentType: '連結送水管',
    conditions: [
      { type: 'basement', operator: '==', value: true },
      { type: 'area', operator: '>=', value: 1000 },
    ],
    legalBasis: '令第29条第1項第2号',
    priority: 88,
    scope: '地階',
    notes: '地階で床面積1000㎡以上',
  },
];
