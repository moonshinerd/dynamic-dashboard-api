import { ChartPayload, RawDataRow } from '../../../domain/entities/Chart';
import { ChartFormatter } from '../../../domain/entities/ChartFormatter';
import { LineChartFormatter } from './LineChartFormatter';

const lineFormatter = new LineChartFormatter();

export class AreaChartFormatter implements ChartFormatter {
  format(data: RawDataRow[]): ChartPayload {
    return lineFormatter.format(data);
  }
}
