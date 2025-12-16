import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from '../../../common/dto/comment.dto';
import { GetAvailabilityResponseDto } from '../../../common/dto/get-availability-response.dto';

class ExcuseDto {
  @ApiProperty({ example: 1 })
  excuseId: number;

  @ApiProperty({ example: 1 })
  meetingId: number;

  @ApiProperty({ example: 'Jane Doe' })
  owner: string;

  @ApiProperty({ example: 'Sorry, I cannot attend' })
  message: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;
}

export class GetResponsesDto {
  @ApiProperty({ example: 1 })
  meetingId: number;

  @ApiProperty({ example: 'abc123' })
  publicId: string;

  @ApiProperty({ example: 'abc123def456' })
  privateId: string;

  @ApiProperty({ example: 'Team Standup Meeting' })
  title: string;

  @ApiProperty({ example: 'Monthly team sync-up', required: false })
  description: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: [GetAvailabilityResponseDto] })
  availabilities: GetAvailabilityResponseDto[];

  @ApiProperty({ type: [ExcuseDto] })
  excuses: ExcuseDto[];

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];
}
