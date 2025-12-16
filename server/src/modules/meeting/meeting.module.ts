import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService, PrismaService],
})
export class MeetingModule {}
