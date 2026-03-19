import { Router } from 'express';
import { ChartController } from '../controllers/ChartController';
import { validateRequest } from '../middlewares/validateRequest';
import { chartParamsSchema, chartQuerySchema } from '../dtos/ChartRequestDto';

/**
 * @swagger
 * /charts/{chartType}:
 *   get:
 *     summary: Get chart data for dashboard
 *     description: Returns data formatted for the specified chart type, filtered by date range.
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: chartType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pie, line, bar, area]
 *         description: The type of chart to generate data for
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *         example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Chart data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartResponse'
 *       400:
 *         description: Invalid parameters or date range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export function createChartRoutes(controller: ChartController): Router {
  const router = Router();

  router.get(
    '/:chartType',
    validateRequest(chartParamsSchema, 'params'),
    validateRequest(chartQuerySchema, 'query'),
    (req, res, next) => controller.getChartData(req, res, next)
  );

  return router;
}
