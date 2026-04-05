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

  it('should format data for "pie" chart with DF values', () => {
    const result = formatForChart(sampleData, 'pie') as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].data).toEqual([90, 100]);
  });

  it('should format data for "bar" chart with multiple datasets', () => {
    const result = formatForChart(sampleData, 'bar') as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(4);
    expect(result.datasets[0]).toEqual({ label: 'DF', data: [90, 100] });
    expect(result.datasets[1]).toEqual({ label: 'MTBF', data: [18, 200] });
    expect(result.datasets[2]).toEqual({ label: 'MTTR', data: [2, 0] });
    expect(result.datasets[3]).toEqual({ label: 'Paradas', data: [5, 0] });
  });

  it('should format data for "line" chart same as "bar"', () => {
    const result = formatForChart(
      sampleData,
      'line',
    ) as ChartFormattedResponse;
    expect(result.labels).toEqual(['COMPRESSORES', 'BOMBAS']);
    expect(result.datasets).toHaveLength(4);
    expect(result.datasets[0].label).toBe('DF');
  });

  it('should handle empty data array', () => {
    const result = formatForChart([], 'pie') as ChartFormattedResponse;
    expect(result.labels).toEqual([]);
    expect(result.datasets[0].data).toEqual([]);
  });
});
