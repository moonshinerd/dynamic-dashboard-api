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
    // Pie chart: proportion of total stops per family (parts of a whole)
    return {
      labels,
      datasets: [{ label: 'Paradas', data: data.map((row) => row.Paradas) }],
    };
  }

  if (chartType === 'bar') {
    // Bar chart: one dataset per KPI, each with compatible scale
    // Separate into percentage-based (DF) and hours-based (MTBF, MTTR) groups
    return {
      labels,
      datasets: [
        { label: 'DF (%)', data: data.map((r) => r.DF) },
        { label: 'MTBF (h)', data: data.map((r) => r.MTBF) },
        { label: 'MTTR (h)', data: data.map((r) => r.MTTR) },
      ],
    };
  }

  // Line chart: time-related metrics (hours) per family, suitable for comparison
  return {
    labels,
    datasets: [
      { label: 'Tempo Previsto (h)', data: data.map((r) => r.tempo_prev) },
      { label: 'Tempo Corretiva (h)', data: data.map((r) => r.tempo_corretiva) },
    ],
  };
}
