import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ValidationMiddleware } from '../../common/validation.middleware';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidationMiddleware).forRoutes(AdminController);
  }
}
