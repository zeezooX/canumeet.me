import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './config/prisma.service';
import { AdminModule } from './modules/admin/admin.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { ResponseModule } from './modules/response/response.module';

@Module({
  imports: [
    MeetingModule,
    AdminModule,
    AvailabilityModule,
    ResponseModule,
    ConfigModule.forRoot(),
    ...(process.env.SERVE_STATIC === 'true'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', '..', 'client', 'build'),
            exclude: ['/api'],
          }),
        ]
      : []),
  ],
  providers: [PrismaService],
})
export class AppModule {}
