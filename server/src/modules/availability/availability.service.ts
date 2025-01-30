import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create availability for a meeting.
   * @param meetingPublicId Public ID of the meeting.
   * @param availabilityDto Availability data.
   * @returns IDs of the availability.
   */
  async createAvailability(meetingPublicId: string, availabilityDto) {
    const publicId = Math.random().toString(36).substring(2, 10);

    const availability = await this.prisma.availability.findUnique({
      where: { publicId },
    });

    if (availability) {
      return this.createAvailability(meetingPublicId, availabilityDto);
    }

    const privateId = publicId + Math.random().toString(36).substring(2, 10);

    await this.prisma.availability.create({
      data: {
        meeting: {
          connect: {
            publicId: meetingPublicId,
          },
        },
        publicId,
        privateId,
        ranges: {
          create: availabilityDto.ranges,
        },
        message: availabilityDto.message,
        owner: availabilityDto.owner,
      },
    });

    return {
      publicId,
      privateId,
    };
  }

  /**
   * Get availability.
   * @param publicId Private ID of the availability.
   * @returns Availability details.
   */
  async getAvailability(publicId: string) {
    return await this.prisma.availability.findUnique({
      where: { publicId },
      include: {
        ranges: true,
      }
    });
  }

  /**
   * Modify availability by private ID.
   * @param publicId Private ID of the availability.
   * @param availabilityDto Availability data.
   * @returns Success message
   */
  async modifyAvailability(publicId: string, availabilityDto) {
    await this.prisma.availability.update({
      where: { publicId },
      data: {
        ranges: {
          deleteMany: {},
          create: availabilityDto.ranges,
        },
        message: availabilityDto.message,
        owner: availabilityDto.owner,
      },
    });

    return {
      message: 'Availability modified',
    };
  }
}
