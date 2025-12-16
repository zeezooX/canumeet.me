import { Module } from '@nestjs/common';
import { ValidationService } from '../../common/validation.service';
import { PrismaService } from '../../config/prisma.service';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService, PrismaService, ValidationService],
})
export class AvailabilityModule {}
