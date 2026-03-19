import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { ChartController } from './presentation/controllers/ChartController';
import { HealthController } from './presentation/controllers/HealthController';
import { createRoutes } from './presentation/routes';

export function createApp(
  chartController: ChartController,
  healthController: HealthController
): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const routes = createRoutes(chartController, healthController);
  app.use('/api/v1', routes);

  app.use(errorHandler);

  return app;
}
