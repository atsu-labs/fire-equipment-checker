import { describe, it, expect } from 'vitest';
import { floorUsageDetailFormSchema } from '../utils/schemas';

describe('floorUsageDetailFormSchema', () => {
  it('valid input parses correctly', () => {
    const input = {
      floor: '1',
      usageCode: '1-i',
      area: '123.45',
      capacity: '20',
      attributes: { noWindow: true, evacuationFloor: false, directStairCount: 1 },
    };

    const parsed = floorUsageDetailFormSchema.parse(input as any);

    expect(parsed.floor).toBe(1);
    expect(parsed.usageCode).toBe('1-i');
    expect(parsed.area).toBeCloseTo(123.45);
    expect(parsed.capacity).toBe(20);
    expect(parsed.attributes?.noWindow).toBe(true);
  });

  it('rejects non-integer floor', () => {
    const input = { floor: '1.5', usageCode: '1-i', area: '10' };
    expect(() => floorUsageDetailFormSchema.parse(input as any)).toThrow();
  });

  it('rejects area > 100000', () => {
    const input = { floor: '1', usageCode: '1-i', area: '100001' };
    expect(() => floorUsageDetailFormSchema.parse(input as any)).toThrow();
  });

  it('allows negative floor for basement', () => {
    const input = { floor: '-1', usageCode: '1-i', area: '50' };
    const parsed = floorUsageDetailFormSchema.parse(input as any);
    expect(parsed.floor).toBe(-1);
  });
});
