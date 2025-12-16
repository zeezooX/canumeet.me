import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from '../../../common/dto/comment.dto';

export class GetMeetingsResponseDto {
  @ApiProperty({ example: 1 })
  meetingId: number;

  @ApiProperty({ example: 'abc123' })
  publicId: string;

  @ApiProperty({ example: 'Team Standup Meeting' })
  title: string;

  @ApiProperty({ example: 'Monthly team sync-up', required: false })
  description: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: [CommentDto], required: false })
  comments?: CommentDto[];
}
