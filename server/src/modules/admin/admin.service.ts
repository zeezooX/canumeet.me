import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get responses of a meeting by public ID.
   * @param publicId Public ID of the meeting.
   * @returns Meeting responses.
   */
  async getResponses(publicId: string) {
    return await this.prisma.meeting.findUnique({
      where: { publicId },
      include: {
        availabilities: {
          include: {
            ranges: true,
          },
        },
        excuses: true,
        comments: {
          include: {
            replies: true,
          },
        },
      },
    });
  }

  /**
   * Modify a meeting by public ID.
   * @param publicId Public ID of the meeting.
   * @param adminMeetingDto Meeting data.
   * @returns Success message.
   */
  async modifyMeeting(publicId: string, adminMeetingDto) {
    await this.prisma.meeting.update({
      where: { publicId },
      data: adminMeetingDto,
    });

    return {
      message: 'Meeting modified',
    };
  }

  /**
   * Delete a meeting by public ID.
   * @param publicId Public ID of the meeting.
   * @returns Success message.
   */
  async deleteMeeting(publicId: string) {
    await this.prisma.meeting.delete({
      where: { publicId },
    });

    return {
      message: 'Meeting deleted',
    };
  }
}
