import { ChartType } from '../../../domain/entities/Chart';
import { ChartFormatter } from '../../../domain/entities/ChartFormatter';
import { AppError } from '../../errors/AppError';
import { AreaChartFormatter } from './AreaChartFormatter';
import { BarChartFormatter } from './BarChartFormatter';
import { LineChartFormatter } from './LineChartFormatter';
import { PieChartFormatter } from './PieChartFormatter';

const formatters: Record<ChartType, ChartFormatter> = {
  pie: new PieChartFormatter(),
  bar: new BarChartFormatter(),
  line: new LineChartFormatter(),
  area: new AreaChartFormatter(),
};

export function getChartFormatter(type: string): ChartFormatter {
  const formatter = formatters[type as ChartType];

  if (!formatter) {
    throw new AppError(
      `Unsupported chart type: ${type}. Supported types: pie, line, bar, area`,
      400,
      'INVALID_CHART_TYPE'
    );
  }

  return formatter;
}
