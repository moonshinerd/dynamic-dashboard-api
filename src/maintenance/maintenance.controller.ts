import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../shared/pipes/zod-validation.pipe';
import {
  performanceIndicatorQuerySchema,
  PerformanceIndicatorQueryDto,
} from './dto/performance-indicator-query.dto';
import { formatForChart } from './utils/chart-formatter';
import type { ChartType } from './utils/chart-formatter';
import type { AuthenticatedUser } from '../auth/auth.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('maintenance')
@ApiBearerAuth()
@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('reports/performance-indicator')
  @ApiOperation({
    summary: 'Get maintenance performance indicators by equipment family',
    description:
      'Returns KPI indicators (DF, MTBF, MTTR, Paradas) grouped by equipment family. ' +
      'Supports multiple response formats via chartType parameter for dashboard integration.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD). Defaults to 30 days ago.',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD). Defaults to today.',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'typeMaintenance',
    required: false,
    description: 'Comma-separated maintenance type IDs',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'chartType',
    required: false,
    enum: ['pie', 'line', 'bar', 'table'],
    description:
      'Response format: table (default), pie (DF per family), bar/line (all KPIs per family)',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance indicators retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - invalid query parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  async getPerformanceIndicator(
    @Query(new ZodValidationPipe(performanceIndicatorQuerySchema))
    query: PerformanceIndicatorQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.maintenanceService.getPerformanceIndicators(
      query,
      req.user.clientId,
    );
    return {
      success: true,
      data: formatForChart(data, query.chartType as ChartType),
    };
  }
}
