import { ChartPayload, DateFilter } from '../../domain/entities/Chart';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { getChartFormatter } from '../../shared/utils/chart-formatters/ChartFormatterFactory';

interface GetChartDataInput {
  chartType: string;
  filter: DateFilter;
}

interface GetChartDataOutput {
  data: ChartPayload;
  meta: {
    startDate: string;
    endDate: string;
    chartType: string;
  };
}

export class GetChartDataUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: GetChartDataInput): Promise<GetChartDataOutput> {
    const formatter = getChartFormatter(input.chartType);
    const rawData = await this.transactionRepository.findAggregatedByDateRange(input.filter);
    const data = formatter.format(rawData);

    return {
      data,
      meta: {
        startDate: input.filter.startDate.toISOString().split('T')[0],
        endDate: input.filter.endDate.toISOString().split('T')[0],
        chartType: input.chartType,
      },
    };
  }
}
