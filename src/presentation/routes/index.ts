import { Router } from 'express';
import { ChartController } from '../controllers/ChartController';
import { HealthController } from '../controllers/HealthController';
import { createChartRoutes } from './chartRoutes';
import { createHealthRoutes } from './healthRoutes';

export function createRoutes(
  chartController: ChartController,
  healthController: HealthController
): Router {
  const router = Router();

  router.use('/charts', createChartRoutes(chartController));
  router.use('/health', createHealthRoutes(healthController));

  return router;
}
