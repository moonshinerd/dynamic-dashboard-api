import type { PerformanceIndicatorResult } from '../maintenance.service';

export type ChartType = 'pie' | 'line' | 'bar' | 'table';

export interface ChartDataset {
  label?: string;
  data: number[];
}

export interface ChartFormattedResponse {
  labels: string[];
  datasets: ChartDataset[];
}

export function formatForChart(
  data: PerformanceIndicatorResult[],
  chartType: ChartType,
): PerformanceIndicatorResult[] | ChartFormattedResponse {
  if (chartType === 'table') {
    return data;
  }

  const labels = data.map((row) => row.Familia);

  if (chartType === 'pie') {
    return {
      labels,
      datasets: [{ data: data.map((row) => row.DF) }],
    };
  }

  // 'bar' and 'line': multi-dataset with all KPIs
  return {
    labels,
    datasets: [
      { label: 'DF', data: data.map((r) => r.DF) },
      { label: 'MTBF', data: data.map((r) => r.MTBF) },
      { label: 'MTTR', data: data.map((r) => r.MTTR) },
      { label: 'Paradas', data: data.map((r) => r.Paradas) },
    ],
  };
}
