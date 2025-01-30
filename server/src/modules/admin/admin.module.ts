import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ValidationService } from '../../common/validation.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, ValidationService],
})
export class AdminModule {}
