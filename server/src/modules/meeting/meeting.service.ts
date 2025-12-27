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
      include: {
        comments: publicId.length === 1,
      },
    });

    meetings.sort((a, b) => publicId.indexOf(a.publicId) - publicId.indexOf(b.publicId));

    return meetings.map((meeting) => {
      delete meeting.privateId;
      return meeting;
    });
  }

  /**
   * Create a meeting.
   * @param createMeetingDto Meeting data.
   * @returns Meeting IDs.
   */
  async createMeeting(createMeetingDto) {
    const publicId = Math.random().toString(36).substring(2, 8);

    const meeting = await this.prisma.meeting.findUnique({
      where: { publicId },
    });

    if (meeting) {
      return this.createMeeting(createMeetingDto);
    }

    const privateId = publicId + Math.random().toString(36).substring(2, 8);

    await this.prisma.meeting.create({
      data: {
        publicId,
        privateId,
        ...createMeetingDto,
      },
    });

    return {
      publicId,
      privateId,
    };
  }
}
