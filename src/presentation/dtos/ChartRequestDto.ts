import { z } from 'zod';
import { CHART_TYPES } from '../../domain/entities/Chart';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const chartParamsSchema = z.object({
  chartType: z.enum(CHART_TYPES as [string, ...string[]], {
    errorMap: () => ({
      message: `Invalid chart type. Supported types: ${CHART_TYPES.join(', ')}`,
    }),
  }),
});

export const chartQuerySchema = z
  .object({
    startDate: z
      .string({ required_error: 'startDate is required' })
      .regex(ISO_DATE_REGEX, 'startDate must be in YYYY-MM-DD format'),
    endDate: z
      .string({ required_error: 'endDate is required' })
      .regex(ISO_DATE_REGEX, 'endDate must be in YYYY-MM-DD format'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    }
  );
