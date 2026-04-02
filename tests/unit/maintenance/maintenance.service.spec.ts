import { MaintenanceService } from '../../../src/maintenance/maintenance.service';
import { MAINTENANCE_REPOSITORY } from '../../../src/maintenance/repositories/maintenance.repository.interface';
import type { MaintenanceRepository } from '../../../src/maintenance/repositories/maintenance.repository.interface';
import { Test } from '@nestjs/testing';

const mockRawData = [
  {
    familia_nome: 'COMPRESSORES',
    tempo_prev: 100,
    tempo_corretiva: 10,
    total_paradas: 5,
  },
  {
    familia_nome: 'BOMBAS',
    tempo_prev: 200,
    tempo_corretiva: 0,
    total_paradas: 0,
  },
  {
    familia_nome: 'MOTORES',
    tempo_prev: 0,
    tempo_corretiva: 0,
    total_paradas: 0,
  },
];

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let mockRepository: jest.Mocked<MaintenanceRepository>;

  beforeEach(async () => {
    mockRepository = {
      getRawPerformanceByFamily: jest.fn().mockResolvedValue(mockRawData),
    };

    const module = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: MAINTENANCE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should calculate KPIs correctly for normal case', async () => {
    const result = await service.getPerformanceIndicators({}, 405);

    const compressores = result.find((r) => r.Familia === 'COMPRESSORES');
    expect(compressores).toBeDefined();
    // DF = ((100 - 10) / 100) * 100 = 90%
    expect(compressores?.DF).toBe(90);
    // MTBF = (100 - 10) / 5 = 18
    expect(compressores?.MTBF).toBe(18);
    // MTTR = 10 / 5 = 2
    expect(compressores?.MTTR).toBe(2);
    expect(compressores?.Paradas).toBe(5);
    expect(compressores?.tempo_prev).toBe(100);
    expect(compressores?.tempo_corretiva).toBe(10);
  });

  it('should use divisor=1 when paradas=0 to avoid division by zero', async () => {
    const result = await service.getPerformanceIndicators({}, 405);

    const bombas = result.find((r) => r.Familia === 'BOMBAS');
    expect(bombas).toBeDefined();
    // DF = ((200 - 0) / 200) * 100 = 100%
    expect(bombas?.DF).toBe(100);
    // MTBF = (200 - 0) / 1 = 200  (using 1 since paradas=0)
    expect(bombas?.MTBF).toBe(200);
    // MTTR = 0 / 1 = 0
    expect(bombas?.MTTR).toBe(0);
    expect(bombas?.Paradas).toBe(0);
  });

  it('should return DF=0 when tempo_prev=0', async () => {
    const result = await service.getPerformanceIndicators({}, 405);

    const motores = result.find((r) => r.Familia === 'MOTORES');
    expect(motores?.DF).toBe(0);
  });

  it('should apply default dates when not provided', async () => {
    await service.getPerformanceIndicators({}, 405);

    const callArgs = mockRepository.getRawPerformanceByFamily.mock.calls[0][0];
    expect(callArgs.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(callArgs.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const start = new Date(callArgs.startDate);
    const end = new Date(callArgs.endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeCloseTo(30, 0);
  });

  it('should parse typeMaintenance IDs correctly', async () => {
    await service.getPerformanceIndicators(
      { typeMaintenance: '1,2,3' },
      405,
    );

    const callArgs = mockRepository.getRawPerformanceByFamily.mock.calls[0][0];
    expect(callArgs.typeMaintenanceIds).toEqual([1, 2, 3]);
  });

  it('should pass empty typeMaintenanceIds when typeMaintenance not provided', async () => {
    await service.getPerformanceIndicators({}, 405);

    const callArgs = mockRepository.getRawPerformanceByFamily.mock.calls[0][0];
    expect(callArgs.typeMaintenanceIds).toEqual([]);
  });

  it('should pass the clientId to the repository', async () => {
    await service.getPerformanceIndicators({}, 405);

    const callArgs = mockRepository.getRawPerformanceByFamily.mock.calls[0][0];
    expect(callArgs.clientId).toBe(405);
  });
});
