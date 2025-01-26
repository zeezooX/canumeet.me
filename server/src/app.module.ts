import { Module } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from './modules/meeting/meeting.module';

@Module({
  imports: [MeetingModule, ConfigModule.forRoot()],
  providers: [PrismaService],
})
export class AppModule {}
