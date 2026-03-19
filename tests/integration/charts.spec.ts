import request from 'supertest';
import { createApp } from '../../src/app';
import { ChartController } from '../../src/presentation/controllers/ChartController';
import { HealthController } from '../../src/presentation/controllers/HealthController';
import { GetChartDataUseCase } from '../../src/application/use-cases/GetChartDataUseCase';
import { TransactionRepository } from '../../src/domain/repositories/TransactionRepository';
import { createRawDataRows } from '../helpers/fixtures';
import { Express } from 'express';

describe('GET /api/v1/charts/:chartType', () => {
  let app: Express;
  let mockRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockRepository = {
      findAggregatedByDateRange: jest.fn().mockResolvedValue(createRawDataRows()),
    };
    const useCase = new GetChartDataUseCase(mockRepository);
    const chartController = new ChartController(useCase);
    const healthController = new HealthController();
    app = createApp(chartController, healthController);
  });

  describe('successful requests', () => {
    it('should return 200 with pie chart data', async () => {
      const response = await request(app)
        .get('/api/v1/charts/pie')
        .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.labels).toBeDefined();
      expect(response.body.data.values).toBeDefined();
      expect(response.body.meta).toEqual({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        chartType: 'pie',
      });
    });

    it('should return 200 with line chart data', async () => {
      const response = await request(app)
        .get('/api/v1/charts/line')
        .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.datasets).toBeDefined();
      expect(response.body.meta.chartType).toBe('line');
    });

    it('should return 200 with bar chart data', async () => {
      const response = await request(app)
        .get('/api/v1/charts/bar')
        .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.datasets).toBeDefined();
      expect(response.body.meta.chartType).toBe('bar');
    });

    it('should return 200 with area chart data', async () => {
      const response = await request(app)
        .get('/api/v1/charts/area')
        .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.datasets).toBeDefined();
      expect(response.body.meta.chartType).toBe('area');
    });
  });

  describe('validation errors', () => {
    it('should return 400 for invalid chart type', async () => {
      const response = await request(app)
        .get('/api/v1/charts/radar')
        .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when startDate is missing', async () => {
      const response = await request(app)
        .get('/api/v1/charts/pie')
        .query({ endDate: '2025-12-31' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when endDate is missing', async () => {
      const response = await request(app)
        .get('/api/v1/charts/pie')
        .query({ startDate: '2025-01-01' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when startDate is after endDate', async () => {
      const response = await request(app)
        .get('/api/v1/charts/pie')
        .query({ startDate: '2025-12-31', endDate: '2025-01-01' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/v1/charts/pie')
        .query({ startDate: '01-01-2025', endDate: '2025-12-31' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
