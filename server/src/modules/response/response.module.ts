import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { ValidationService } from '../../common/validation.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService, PrismaService, ValidationService],
})
export class ResponseModule {}
