import { Module } from '@nestjs/common';
import { ValidationService } from '../../common/validation.service';
import { PrismaService } from '../../config/prisma.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, ValidationService],
})
export class AdminModule {}
