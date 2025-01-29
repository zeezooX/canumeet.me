import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { Request, Response, NextFunction } from 'express';

export class ValidationMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { privateId } = req.params;

    if (!privateId) {
      throw new BadRequestException('Private ID is required');
    }

    if (privateId.length !== 12) {
      throw new BadRequestException('Invalid Private ID');
    }

    const publicId = privateId.slice(0, 6);

    const meeting = await this.prisma.meeting.findUnique({
      where: { publicId },
    });

    if (!meeting) {
      throw new BadRequestException('Invalid Public ID');
    }

    if (meeting.privateId !== privateId) {
      throw new BadRequestException('Invalid Private ID');
    }

    req.body.publicId = publicId;

    next();
  }
}
