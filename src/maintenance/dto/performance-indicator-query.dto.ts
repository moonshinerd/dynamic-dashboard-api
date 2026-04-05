import { z } from 'zod';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const performanceIndicatorQuerySchema = z
  .object({
    startDate: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z
        .string()
        .regex(ISO_DATE_REGEX, 'startDate must be in YYYY-MM-DD format')
        .optional(),
    ),
    endDate: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z
        .string()
        .regex(ISO_DATE_REGEX, 'endDate must be in YYYY-MM-DD format')
        .optional(),
    ),
    typeMaintenance: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.string().optional(),
    ),
    chartType: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['pie', 'line', 'bar', 'table']).optional().default('table'),
    ),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    },
  );

export type PerformanceIndicatorQueryDto = z.infer<
  typeof performanceIndicatorQuerySchema
>;
