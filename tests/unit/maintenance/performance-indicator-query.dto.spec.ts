import { performanceIndicatorQuerySchema } from '../../../src/maintenance/dto/performance-indicator-query.dto';

describe('performanceIndicatorQuerySchema', () => {
  it('should accept valid dates', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toBe('2024-01-01');
      expect(result.data.endDate).toBe('2024-12-31');
    }
  });

  it('should accept empty/undefined values and return undefined', () => {
    const result = performanceIndicatorQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toBeUndefined();
      expect(result.data.endDate).toBeUndefined();
    }
  });

  it('should convert empty strings to undefined', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      startDate: '',
      endDate: '',
      typeMaintenance: '',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toBeUndefined();
      expect(result.data.endDate).toBeUndefined();
      expect(result.data.typeMaintenance).toBeUndefined();
    }
  });

  it('should reject invalid date format', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      startDate: '01/01/2024',
    });
    expect(result.success).toBe(false);
  });

  it('should reject startDate after endDate', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      startDate: '2024-12-31',
      endDate: '2024-01-01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten();
      expect(errors.fieldErrors.startDate).toBeDefined();
    }
  });

  it('should accept equal startDate and endDate', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      startDate: '2024-06-01',
      endDate: '2024-06-01',
    });
    expect(result.success).toBe(true);
  });

  it('should accept typeMaintenance as comma-separated string', () => {
    const result = performanceIndicatorQuerySchema.safeParse({
      typeMaintenance: '1,2,3',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.typeMaintenance).toBe('1,2,3');
    }
  });
});
