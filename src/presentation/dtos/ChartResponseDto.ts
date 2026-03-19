import { ChartPayload } from '../../domain/entities/Chart';

export interface ChartResponseDto {
  data: ChartPayload;
  meta: {
    startDate: string;
    endDate: string;
    chartType: string;
  };
}
