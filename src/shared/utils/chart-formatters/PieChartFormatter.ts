import { ChartPayload, RawDataRow } from '../../../domain/entities/Chart';
import { ChartFormatter } from '../../../domain/entities/ChartFormatter';

export class PieChartFormatter implements ChartFormatter {
  format(data: RawDataRow[]): ChartPayload {
    const aggregated = new Map<string, number>();

    for (const row of data) {
      const current = aggregated.get(row.category) ?? 0;
      aggregated.set(row.category, current + row.totalAmount);
    }

    const labels: string[] = [];
    const values: number[] = [];

    for (const [category, total] of aggregated) {
      labels.push(category);
      values.push(Number(total.toFixed(2)));
    }

    return { labels, values };
  }
}
