import { Module } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    PrismaService,
  ],
})
export class AppModule {}
