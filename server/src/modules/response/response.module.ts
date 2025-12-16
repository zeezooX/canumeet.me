import { Module } from '@nestjs/common';
import { ValidationService } from '../../common/validation.service';
import { PrismaService } from '../../config/prisma.service';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService, PrismaService, ValidationService],
})
export class ResponseModule {}
