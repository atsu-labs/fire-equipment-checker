import type { InstallationRule } from '../../types';

/**
 * 避難器具設置基準ルール (令第25条)
 */
export const EVACUATION_RULES: InstallationRule[] = [
  {
    id: 'EV-001',
    equipmentType: '避難器具',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '4', '5-i', '6-i', '6-ro', '6-ha', '9-i', '16-i'] },
      { type: 'floors', operator: '==', value: 2 },
      { type: 'capacity', operator: '>=', value: 20 },
    ],
    legalBasis: '令第25条第1項第1号',
    priority: 90,
    scope: '2階',
    notes: '特定用途の2階で収容人員20人以上',
  },
  {
    id: 'EV-002',
    equipmentType: '避難器具',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '4', '5-i', '6-i', '6-ro', '6-ha', '9-i', '16-i'] },
      { type: 'floors', operator: '>=', value: 3 },
      { type: 'capacity', operator: '>=', value: 10 },
    ],
    legalBasis: '令第25条第1項第2号',
    priority: 92,
    scope: '3階以上',
    notes: '特定用途の3階以上で収容人員10人以上',
  },
  {
    id: 'EV-003',
    equipmentType: '避難器具',
    conditions: [
      { type: 'usage', operator: 'in', value: ['6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5'] },
      { type: 'floors', operator: '>=', value: 2 },
    ],
    legalBasis: '令第25条第1項第3号',
    priority: 100,
    scope: '2階以上',
    notes: '(六)ロは避難階以外の全ての階',
  },
  {
    id: 'EV-004',
    equipmentType: '避難器具',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '6-i', '6-ro', '6-ha', '9-i', '12-ro', '13-i'] },
      { type: 'basement', operator: '==', value: true },
      { type: 'capacity', operator: '>=', value: 20 },
    ],
    legalBasis: '令第25条第1項第4号',
    priority: 88,
    scope: '地階',
    notes: '特定用途の地階で収容人員20人以上',
  },
];
