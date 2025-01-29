import { Module } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from './modules/meeting/meeting.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MeetingModule,
    AdminModule,
    ConfigModule.forRoot(),
    ...(process.env.SERVE_STATIC === 'true' ? [ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'client', 'build'),
      exclude: ['/api'],
    })] : []),
  ],
  providers: [PrismaService],
})
export class AppModule {}
