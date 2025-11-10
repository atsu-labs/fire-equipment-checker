import { describe, it, expect } from 'vitest';
import { buildingInfoFormSchemaExtended } from '../utils/schemas';

describe('buildingInfoFormSchemaExtended', () => {
  it('parses valid non-composite usage input', () => {
    const input = {
      usageCode: '1-i',
      totalArea: '500.12',
      floors: '2',
      undergroundFloors: '0',
    };

    const parsed = buildingInfoFormSchemaExtended.parse(input as any);
    expect(parsed.usageCode).toBe('1-i');
    expect(parsed.totalArea).toBeCloseTo(500.12);
    expect(parsed.floors).toBe(2);
  });

  it('requires floorUsageDetails for composite usage (16系)', () => {
    const input = {
      usageCode: '16-i',
      totalArea: '100.00',
      floors: '3',
      undergroundFloors: '0',
      floorUsageDetails: [],
    };

    expect(() => buildingInfoFormSchemaExtended.parse(input as any)).toThrow();
  });

  it('rejects totalArea with non-numeric value', () => {
    const input = { usageCode: '1-i', totalArea: 'abc', floors: '1', undergroundFloors: '0' };
    expect(() => buildingInfoFormSchemaExtended.parse(input as any)).toThrow();
  });
});
