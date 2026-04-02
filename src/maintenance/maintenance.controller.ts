import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import {
  performanceIndicatorQuerySchema,
  PerformanceIndicatorQueryDto,
} from './dto/performance-indicator-query.dto';
import type { AuthenticatedUser } from '../auth/auth.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * GET /maintenance/reports/performance-indicator
 *
 * Returns KPI performance indicators grouped by equipment family.
 *
 * Query Parameters:
 *   - startDate (optional, YYYY-MM-DD): start of period (default: 30 days ago)
 *   - endDate   (optional, YYYY-MM-DD): end of period (default: today)
 *   - typeMaintenance (optional, string): comma-separated maintenance type IDs (e.g. "1,2,3")
 *
 * Response:
 *   { success: true, data: [ { Familia, DF, MTBF, MTTR, Paradas, tempo_prev, tempo_corretiva } ] }
 *
 * Requires: Authorization: Bearer <token>  (obtain via POST /auth/login)
 */
@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('reports/performance-indicator')
  async getPerformanceIndicator(
    @Query(new ZodValidationPipe(performanceIndicatorQuerySchema))
    query: PerformanceIndicatorQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.maintenanceService.getPerformanceIndicators(
      query,
      req.user.clientId,
    );
    return { success: true, data };
  }
}
