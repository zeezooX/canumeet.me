import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class MeetingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get meetings by public ID.
   * @param publicId Public ID(s) of the meeting.
   * @returns Meetings.
   */
  async getMeetings(publicId: string[]) {
    const meetings = await this.prisma.meeting.findMany({
      where: {
        publicId: {
          in: publicId,
        },
      },
    });

    return meetings.map((meeting) => {
      const { privateId, ...rest } = meeting;
      return rest;
    });
  }
}
