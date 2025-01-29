import { Module } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from './modules/meeting/meeting.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [MeetingModule, AdminModule, ConfigModule.forRoot()],
  providers: [PrismaService],
})
export class AppModule {}
