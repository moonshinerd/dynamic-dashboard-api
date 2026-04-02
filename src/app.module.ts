import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [PrismaModule, AuthModule, MaintenanceModule],
})
export class AppModule {}
