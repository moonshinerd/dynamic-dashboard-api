import { Injectable, Inject } from '@nestjs/common';
import {
  MaintenanceRepository,
  MAINTENANCE_REPOSITORY,
  PerformanceIndicatorParams,
} from './repositories/maintenance.repository.interface';
import type { PerformanceIndicatorQueryDto } from './dto/performance-indicator-query.dto';

export interface PerformanceIndicatorResult {
  Familia: string;
  DF: number;
  MTBF: number;
  MTTR: number;
  Paradas: number;
  tempo_prev: number;
  tempo_corretiva: number;
}

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  async getPerformanceIndicators(
    query: PerformanceIndicatorQueryDto,
    clientId: number,
  ): Promise<PerformanceIndicatorResult[]> {
    const now = new Date();
    const endDate =
      query.endDate ?? now.toISOString().split('T')[0];
    const startDate =
      query.startDate ??
      new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const typeMaintenanceIds = query.typeMaintenance
      ? query.typeMaintenance
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n))
      : [];

    const params: PerformanceIndicatorParams = {
      startDate,
      endDate,
      clientId,
      typeMaintenanceIds,
    };

    const rawData =
      await this.maintenanceRepository.getRawPerformanceByFamily(params);

    return rawData.map((row) => {
      const paradas = row.total_paradas;
      const divisor = paradas === 0 ? 1 : paradas;
      const tempoPrev = row.tempo_prev;
      const tempoCorretiva = row.tempo_corretiva;
      const tempoDisponivel = tempoPrev - tempoCorretiva;

      const df = tempoPrev > 0 ? (tempoDisponivel / tempoPrev) * 100 : 0;
      const mtbf = tempoDisponivel / divisor;
      const mttr = tempoCorretiva / divisor;

      return {
        Familia: row.familia_nome,
        DF: Math.round(df * 100) / 100,
        MTBF: Math.round(mtbf * 100) / 100,
        MTTR: Math.round(mttr * 100) / 100,
        Paradas: paradas,
        tempo_prev: Math.round(tempoPrev * 100) / 100,
        tempo_corretiva: Math.round(tempoCorretiva * 100) / 100,
      };
    });
  }
}
