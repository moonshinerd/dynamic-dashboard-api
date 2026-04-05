import {
  formatForChart,
  ChartFormattedResponse,
} from '../../../src/maintenance/utils/chart-formatter';
import type { PerformanceIndicatorResult } from '../../../src/maintenance/maintenance.service';

const sampleData: PerformanceIndicatorResult[] = [
  {
    Familia: 'COMPRESSORES',
    DF: 90,
    MTBF: 18,
    MTTR: 2,
    Paradas: 5,
    tempo_prev: 100,
    tempo_corretiva: 10,
  },
  {
    Familia: 'BOMBAS',
    DF: 100,
    MTBF: 200,
    MTTR: 0,
    Paradas: 0,
    tempo_prev: 200,
    tempo_corretiva: 0,
  },
];

describe('formatForChart', () => {
  it('should return data unchanged for "table" type', () => {
    const result = formatForChart(sampleData, 'table');
    expect(result).toEqual(sampleData);
  });

  it('should format "pie" with Paradas (proportion of stops per family)', () => {
    const result = formatForChart(sampleData, 'pie') as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].label).toBe('Paradas');
    expect(result.datasets[0].data).toEqual([5, 0]);
  });

  it('should format "bar" with DF, MTBF and MTTR datasets', () => {
    const result = formatForChart(sampleData, 'bar') as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(3);
    expect(result.datasets[0]).toEqual({ label: 'DF (%)', data: [90, 100] });
    expect(result.datasets[1]).toEqual({ label: 'MTBF (h)', data: [18, 200] });
    expect(result.datasets[2]).toEqual({ label: 'MTTR (h)', data: [2, 0] });
  });

  it('should format "line" with tempo_prev and tempo_corretiva', () => {
    const result = formatForChart(
      sampleData,
      'line',
    ) as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(2);
    expect(result.datasets[0]).toEqual({
      label: 'Tempo Previsto (h)',
      data: [100, 200],
    });
    expect(result.datasets[1]).toEqual({
      label: 'Tempo Corretiva (h)',
      data: [10, 0],
    });
  });

  it('should handle empty data array', () => {
    const result = formatForChart([], 'pie') as ChartFormattedResponse;
    expect(result.labels).toEqual([]);
    expect(result.datasets[0].data).toEqual([]);
  });
});
