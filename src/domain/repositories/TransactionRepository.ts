import { DateFilter, RawDataRow } from '../entities/Chart';

export interface TransactionRepository {
  findAggregatedByDateRange(filter: DateFilter): Promise<RawDataRow[]>;
}
