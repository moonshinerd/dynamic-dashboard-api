import { BarChartFormatter } from '../../../../../src/shared/utils/chart-formatters/BarChartFormatter';
import { createRawDataRows, createEmptyRawData } from '../../../../helpers/fixtures';

describe('BarChartFormatter', () => {
  const formatter = new BarChartFormatter();

  it('should aggregate amounts by category with datasets format', () => {
    const result = formatter.format(createRawDataRows());

    expect(result.labels).toEqual(['Electronics', 'Clothing', 'Food & Beverages']);
    expect(result.datasets).toEqual([
      { label: 'Total Amount', values: [3500.0, 750.0, 120.0] },
    ]);
    expect(result.values).toBeUndefined();
  });

  it('should return empty arrays for empty data', () => {
    const result = formatter.format(createEmptyRawData());

    expect(result.labels).toEqual([]);
    expect(result.datasets).toEqual([{ label: 'Total Amount', values: [] }]);
  });
});
