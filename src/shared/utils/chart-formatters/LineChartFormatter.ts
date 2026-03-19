import { ChartPayload, RawDataRow } from '../../../domain/entities/Chart';
import { ChartFormatter } from '../../../domain/entities/ChartFormatter';

export class LineChartFormatter implements ChartFormatter {
  format(data: RawDataRow[]): ChartPayload {
    const dates = new Set<string>();
    const categoriesMap = new Map<string, Map<string, number>>();

    for (const row of data) {
      dates.add(row.date);

      if (!categoriesMap.has(row.category)) {
        categoriesMap.set(row.category, new Map());
      }

      const dateMap = categoriesMap.get(row.category)!;
      const current = dateMap.get(row.date) ?? 0;
      dateMap.set(row.date, current + row.totalAmount);
    }

    const sortedDates = Array.from(dates).sort();
    const datasets = Array.from(categoriesMap).map(([category, dateMap]) => ({
      label: category,
      values: sortedDates.map((date) => Number((dateMap.get(date) ?? 0).toFixed(2))),
    }));

    return { labels: sortedDates, datasets };
  }
}
