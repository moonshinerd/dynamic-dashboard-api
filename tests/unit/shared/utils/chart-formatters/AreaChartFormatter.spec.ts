import { AreaChartFormatter } from '../../../../../src/shared/utils/chart-formatters/AreaChartFormatter';
import { createRawDataRows } from '../../../../helpers/fixtures';

describe('AreaChartFormatter', () => {
  const formatter = new AreaChartFormatter();

  it('should produce the same output as LineChartFormatter', () => {
    const result = formatter.format(createRawDataRows());

    expect(result.labels).toEqual(['2025-01-01', '2025-01-02']);
    expect(result.datasets).toHaveLength(3);
    expect(result.datasets![0].label).toBe('Electronics');
  });
});
