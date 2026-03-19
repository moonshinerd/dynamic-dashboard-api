import { ChartPayload, RawDataRow } from './Chart';

export interface ChartFormatter {
  format(data: RawDataRow[]): ChartPayload;
}
