import { getChartFormatter } from '../../../../../src/shared/utils/chart-formatters/ChartFormatterFactory';
import { PieChartFormatter } from '../../../../../src/shared/utils/chart-formatters/PieChartFormatter';
import { BarChartFormatter } from '../../../../../src/shared/utils/chart-formatters/BarChartFormatter';
import { LineChartFormatter } from '../../../../../src/shared/utils/chart-formatters/LineChartFormatter';
import { AreaChartFormatter } from '../../../../../src/shared/utils/chart-formatters/AreaChartFormatter';
import { AppError } from '../../../../../src/shared/errors/AppError';

describe('ChartFormatterFactory', () => {
  it('should return PieChartFormatter for "pie"', () => {
    expect(getChartFormatter('pie')).toBeInstanceOf(PieChartFormatter);
  });

  it('should return BarChartFormatter for "bar"', () => {
    expect(getChartFormatter('bar')).toBeInstanceOf(BarChartFormatter);
  });

  it('should return LineChartFormatter for "line"', () => {
    expect(getChartFormatter('line')).toBeInstanceOf(LineChartFormatter);
  });

  it('should return AreaChartFormatter for "area"', () => {
    expect(getChartFormatter('area')).toBeInstanceOf(AreaChartFormatter);
  });

  it('should throw AppError for unsupported chart type', () => {
    expect(() => getChartFormatter('radar')).toThrow(AppError);
    expect(() => getChartFormatter('radar')).toThrow('Unsupported chart type: radar');
  });
});
