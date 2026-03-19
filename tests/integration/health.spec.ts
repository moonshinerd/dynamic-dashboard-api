import request from 'supertest';
import { createApp } from '../../src/app';
import { ChartController } from '../../src/presentation/controllers/ChartController';
import { HealthController } from '../../src/presentation/controllers/HealthController';
import { GetChartDataUseCase } from '../../src/application/use-cases/GetChartDataUseCase';
import { TransactionRepository } from '../../src/domain/repositories/TransactionRepository';

describe('GET /api/v1/health', () => {
  const mockRepository: TransactionRepository = {
    findAggregatedByDateRange: jest.fn().mockResolvedValue([]),
  };
  const useCase = new GetChartDataUseCase(mockRepository);
  const chartController = new ChartController(useCase);
  const healthController = new HealthController();
  const app = createApp(chartController, healthController);

  it('should return 200 with status ok', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
