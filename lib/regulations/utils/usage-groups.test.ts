import { describe, it, expect } from 'vitest';
import { USAGE_TYPES } from '@/lib/regulations/data/usage-types';
import { groupUsageTypes } from '@/lib/regulations/utils/usage-groups';

describe('groupUsageTypes', () => {
  it('should group usage types by category and include expected category labels', () => {
    const groups = groupUsageTypes(USAGE_TYPES);

    // Expect some known category labels present
    expect(Object.keys(groups)).toContain('(一)項');
    expect(Object.keys(groups)).toContain('(十六)項');

    // Each group should be a non-empty array of options with code and label
    const ichiGroup = groups['(一)項'];
    expect(Array.isArray(ichiGroup)).toBe(true);
    expect(ichiGroup.length).toBeGreaterThan(0);
    expect(ichiGroup[0]).toHaveProperty('code');
    expect(ichiGroup[0]).toHaveProperty('label');
  });
});
