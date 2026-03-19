import { GetChartDataUseCase } from '../../../../src/application/use-cases/GetChartDataUseCase';
import { TransactionRepository } from '../../../../src/domain/repositories/TransactionRepository';
import { createRawDataRows } from '../../../helpers/fixtures';
import { AppError } from '../../../../src/shared/errors/AppError';

describe('GetChartDataUseCase', () => {
  let useCase: GetChartDataUseCase;
  let mockRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockRepository = {
      findAggregatedByDateRange: jest.fn(),
    };
    useCase = new GetChartDataUseCase(mockRepository);
  });

  it('should return pie chart data with correct envelope', async () => {
    mockRepository.findAggregatedByDateRange.mockResolvedValue(createRawDataRows());

    const result = await useCase.execute({
      chartType: 'pie',
      filter: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      },
    });

    expect(result.meta).toEqual({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      chartType: 'pie',
    });
    expect(result.data.labels).toBeDefined();
    expect(result.data.values).toBeDefined();
  });

  it('should return line chart data with datasets', async () => {
    mockRepository.findAggregatedByDateRange.mockResolvedValue(createRawDataRows());

    const result = await useCase.execute({
      chartType: 'line',
      filter: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      },
    });

    expect(result.data.datasets).toBeDefined();
    expect(result.meta.chartType).toBe('line');
  });

  it('should call repository with correct date filter', async () => {
    mockRepository.findAggregatedByDateRange.mockResolvedValue([]);
    const filter = {
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
    };

    await useCase.execute({ chartType: 'bar', filter });

    expect(mockRepository.findAggregatedByDateRange).toHaveBeenCalledWith(filter);
  });

  it('should throw for invalid chart type', async () => {
    await expect(
      useCase.execute({
        chartType: 'invalid',
        filter: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31'),
        },
      })
    ).rejects.toThrow(AppError);
  });
});
