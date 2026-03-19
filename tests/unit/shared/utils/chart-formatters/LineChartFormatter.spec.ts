import { LineChartFormatter } from '../../../../../src/shared/utils/chart-formatters/LineChartFormatter';
import { createRawDataRows, createEmptyRawData, createSingleCategoryData } from '../../../../helpers/fixtures';

describe('LineChartFormatter', () => {
  const formatter = new LineChartFormatter();

  it('should format data as time series with datasets per category', () => {
    const result = formatter.format(createRawDataRows());

    expect(result.labels).toEqual(['2025-01-01', '2025-01-02']);
    expect(result.datasets).toHaveLength(3);

    const electronics = result.datasets!.find((d) => d.label === 'Electronics');
    expect(electronics?.values).toEqual([1500.0, 2000.0]);

    const clothing = result.datasets!.find((d) => d.label === 'Clothing');
    expect(clothing?.values).toEqual([300.0, 450.0]);

    const food = result.datasets!.find((d) => d.label === 'Food & Beverages');
    expect(food?.values).toEqual([120.0, 0]);
  });

  it('should return empty arrays for empty data', () => {
    const result = formatter.format(createEmptyRawData());

    expect(result.labels).toEqual([]);
    expect(result.datasets).toEqual([]);
  });

  it('should handle single category data', () => {
    const result = formatter.format(createSingleCategoryData());

    expect(result.labels).toEqual(['2025-03-01', '2025-03-02']);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets![0]).toEqual({
      label: 'Electronics',
      values: [500.0, 750.0],
    });
  });
});
