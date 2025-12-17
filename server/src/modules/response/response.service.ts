import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send comment for a meeting.
   * @param publicId - Public ID of the meeting.
   * @param sendResponseDto - Comment details.
   * @param parentId - Parent comment ID to reply to.
   * @param isAdmin - Whether the comment is from an admin.
   * @param isUpdate - Whether the comment is an update.
   * @returns Success message.
   */
  async sendComment(
    publicId: string,
    sendResponseDto: CreateResponseDto,
    parentId: number = null,
    isAdmin: boolean = false,
    isUpdate: boolean = false
  ) {
    await this.prisma.comment.create({
      data: {
        meeting: {
          connect: {
            publicId,
          },
        },
        ...sendResponseDto,
        parent: parentId
          ? {
              connect: {
                commentId: parentId,
              },
            }
          : undefined,
        isAdmin,
        isUpdate,
      },
    });

    return { message: 'Response sent' };
  }

  /**
   * Send excuse for a meeting.
   * @param publicId - Public ID of the meeting.
   * @param sendResponseDto - Excuse details.
   * @returns Success message.
   */
  async sendExcuse(publicId: string, sendResponseDto: CreateResponseDto) {
    const meeting = await this.prisma.meeting.findUnique({
      where: {
        publicId,
      },
    });

    if (!meeting) {
      throw new BadRequestException('Meeting not found');
    }

    await this.prisma.excuse.create({
      data: {
        meeting: {
          connect: {
            publicId,
          },
        },
        ...sendResponseDto,
      },
    });

    return { message: 'Excuse sent' };
  }
}
