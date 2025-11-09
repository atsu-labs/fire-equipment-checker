import type { InstallationRule } from '../../types';

/**
 * 非常コンセント設備設置基準ルール (令第29条の2)
 */
export const EMERGENCY_OUTLET_RULES: InstallationRule[] = [
  {
    id: 'EC-001',
    equipmentType: '非常コンセント設備',
    conditions: [
      { type: 'floors', operator: '>=', value: 11 },
    ],
    legalBasis: '令第29条の2',
    priority: 85,
    scope: '11階以上',
    notes: '11階以上の各階',
  },
];
