import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { ValidationService } from '../../common/validation.service';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService, PrismaService, ValidationService],
})
export class AvailabilityModule {}
