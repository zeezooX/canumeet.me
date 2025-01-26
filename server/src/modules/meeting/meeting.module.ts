import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService, PrismaService],
})
export class MeetingModule {}
