import type { InstallationRule } from '../../types';

/**
 * 誘導灯・誘導標識設置基準ルール (令第26条)
 */
export const GUIDE_LIGHT_RULES: InstallationRule[] = [
  {
    id: 'GL-001',
    equipmentType: '誘導灯',
    conditions: [
      { type: 'usage', operator: 'in', value: ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4', '5-i', '6-i', '6-ro', '6-ha', '9-i', '16-i', '16-2'] },
    ],
    legalBasis: '令第26条',
    priority: 100,
    scope: '全域',
    notes: '特定用途・地下街(面積不問)',
  },
];
