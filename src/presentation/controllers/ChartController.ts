import { Request, Response, NextFunction } from 'express';
import { GetChartDataUseCase } from '../../application/use-cases/GetChartDataUseCase';

export class ChartController {
  constructor(private readonly getChartDataUseCase: GetChartDataUseCase) {}

  async getChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chartType } = req.params;
      const { startDate, endDate } = req.query as { startDate: string; endDate: string };

      const result = await this.getChartDataUseCase.execute({
        chartType,
        filter: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
