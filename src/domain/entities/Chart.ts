export type ChartType = 'pie' | 'line' | 'bar' | 'area';

export const CHART_TYPES: ChartType[] = ['pie', 'line', 'bar', 'area'];

export interface DateFilter {
  startDate: Date;
  endDate: Date;
}

export interface RawDataRow {
  category: string;
  date: string;
  totalAmount: number;
  totalQuantity: number;
}

export interface ChartDataset {
  label: string;
  values: number[];
}

export interface ChartPayload {
  labels: string[];
  values?: number[];
  datasets?: ChartDataset[];
}
