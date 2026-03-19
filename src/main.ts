import { env } from './config/env';
import { getPrismaClient } from './infrastructure/database/prisma/client';
import { PrismaTransactionRepository } from './infrastructure/repositories/PrismaTransactionRepository';
import { GetChartDataUseCase } from './application/use-cases/GetChartDataUseCase';
import { ChartController } from './presentation/controllers/ChartController';
import { HealthController } from './presentation/controllers/HealthController';
import { createApp } from './app';
import pino from 'pino';

const logger = pino({
  transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});

const prismaClient = getPrismaClient();
const transactionRepository = new PrismaTransactionRepository(prismaClient);
const getChartDataUseCase = new GetChartDataUseCase(transactionRepository);
const chartController = new ChartController(getChartDataUseCase);
const healthController = new HealthController();

const app = createApp(chartController, healthController);

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
  logger.info(`Swagger docs at http://localhost:${env.PORT}/api-docs`);
});
