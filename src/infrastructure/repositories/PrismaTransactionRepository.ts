import { PrismaClient } from '@prisma/client';
import { DateFilter, RawDataRow } from '../../domain/entities/Chart';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

interface RawQueryResult {
  category: string;
  date: string;
  totalAmount: number;
  totalQuantity: number;
}

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAggregatedByDateRange(filter: DateFilter): Promise<RawDataRow[]> {
    const results = await this.prisma.$queryRaw<RawQueryResult[]>`
      SELECT
        category,
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        CAST(SUM(amount) AS DOUBLE) as totalAmount,
        CAST(SUM(quantity) AS SIGNED) as totalQuantity
      FROM transactions
      WHERE created_at >= ${filter.startDate}
        AND created_at < DATE_ADD(${filter.endDate}, INTERVAL 1 DAY)
      GROUP BY category, DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date ASC, category ASC
    `;

    return results.map((row) => ({
      category: row.category,
      date: row.date,
      totalAmount: Number(row.totalAmount),
      totalQuantity: Number(row.totalQuantity),
    }));
  }
}
