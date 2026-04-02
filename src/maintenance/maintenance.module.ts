import { Module } from '@nestjs/common';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { PrismaMaintenanceRepository } from './repositories/prisma-maintenance.repository';
import { MAINTENANCE_REPOSITORY } from './repositories/maintenance.repository.interface';

@Module({
  controllers: [MaintenanceController],
  providers: [
    MaintenanceService,
    {
      provide: MAINTENANCE_REPOSITORY,
      useClass: PrismaMaintenanceRepository,
    },
  ],
})
export class MaintenanceModule {}
