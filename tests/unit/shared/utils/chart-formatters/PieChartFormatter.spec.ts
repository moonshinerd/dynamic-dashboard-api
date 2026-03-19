import { PieChartFormatter } from '../../../../../src/shared/utils/chart-formatters/PieChartFormatter';
import { createRawDataRows, createEmptyRawData } from '../../../../helpers/fixtures';

describe('PieChartFormatter', () => {
  const formatter = new PieChartFormatter();

  it('should aggregate amounts by category', () => {
    const result = formatter.format(createRawDataRows());

    expect(result.labels).toEqual(['Electronics', 'Clothing', 'Food & Beverages']);
    expect(result.values).toEqual([3500.0, 750.0, 120.0]);
    expect(result.datasets).toBeUndefined();
  });

  it('should return empty arrays for empty data', () => {
    const result = formatter.format(createEmptyRawData());

    expect(result.labels).toEqual([]);
    expect(result.values).toEqual([]);
  });
});
