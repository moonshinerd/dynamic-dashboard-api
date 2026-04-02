export interface PerformanceIndicatorParams {
  startDate: string;
  endDate: string;
  clientId: number;
  typeMaintenanceIds: number[];
}

export interface RawPerformanceRow {
  familia_nome: string;
  tempo_prev: number;
  tempo_corretiva: number;
  total_paradas: number;
}

export interface MaintenanceRepository {
  getRawPerformanceByFamily(
    params: PerformanceIndicatorParams,
  ): Promise<RawPerformanceRow[]>;
}

export const MAINTENANCE_REPOSITORY = 'MAINTENANCE_REPOSITORY';
