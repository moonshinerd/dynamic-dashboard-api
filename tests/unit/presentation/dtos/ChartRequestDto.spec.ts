import { chartParamsSchema, chartQuerySchema } from '../../../../src/presentation/dtos/ChartRequestDto';

describe('ChartRequestDto', () => {
  describe('chartParamsSchema', () => {
    it('should accept valid chart types', () => {
      expect(chartParamsSchema.parse({ chartType: 'pie' })).toEqual({ chartType: 'pie' });
      expect(chartParamsSchema.parse({ chartType: 'line' })).toEqual({ chartType: 'line' });
      expect(chartParamsSchema.parse({ chartType: 'bar' })).toEqual({ chartType: 'bar' });
      expect(chartParamsSchema.parse({ chartType: 'area' })).toEqual({ chartType: 'area' });
    });

    it('should reject invalid chart types', () => {
      expect(() => chartParamsSchema.parse({ chartType: 'radar' })).toThrow();
      expect(() => chartParamsSchema.parse({ chartType: '' })).toThrow();
    });
  });

  describe('chartQuerySchema', () => {
    it('should accept valid date range', () => {
      const result = chartQuerySchema.parse({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      });
      expect(result.startDate).toBe('2025-01-01');
      expect(result.endDate).toBe('2025-12-31');
    });

    it('should accept same start and end date', () => {
      const result = chartQuerySchema.parse({
        startDate: '2025-06-15',
        endDate: '2025-06-15',
      });
      expect(result.startDate).toBe('2025-06-15');
    });

    it('should reject when startDate is after endDate', () => {
      expect(() =>
        chartQuerySchema.parse({
          startDate: '2025-12-31',
          endDate: '2025-01-01',
        })
      ).toThrow();
    });

    it('should reject invalid date format', () => {
      expect(() =>
        chartQuerySchema.parse({
          startDate: '01-01-2025',
          endDate: '2025-12-31',
        })
      ).toThrow();
    });

    it('should reject missing startDate', () => {
      expect(() => chartQuerySchema.parse({ endDate: '2025-12-31' })).toThrow();
    });

    it('should reject missing endDate', () => {
      expect(() => chartQuerySchema.parse({ startDate: '2025-01-01' })).toThrow();
    });
  });
});
