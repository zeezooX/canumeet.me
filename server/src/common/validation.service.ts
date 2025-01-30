import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the public ID from the private ID
   * @param privateId The private ID
   * @returns The public ID
   * @throws BadRequestException
   */
  async getPublicId(privateId: string): Promise<string> {
    if (privateId.length === 12) {
      const publicId = privateId.slice(0, 6);

      const meeting = await this.prisma.meeting.findUnique({
        where: { publicId },
      });

      if (!meeting) {
        throw new BadRequestException('Meeting not found');
      }

      if (meeting.privateId !== privateId) {
        throw new BadRequestException('Invalid Private ID');
      }

      return publicId;
    }
    if (privateId.length === 16) {
      const publicId = privateId.slice(0, 8);

      const availability = await this.prisma.availability.findUnique({
        where: { publicId },
      });

      if (!availability) {
        throw new BadRequestException('Availability not found');
      }

      if (availability.privateId !== privateId) {
        throw new BadRequestException('Invalid Private ID');
      }

      return publicId;
    }
    throw new BadRequestException('Improper Private ID length');
  }
}
