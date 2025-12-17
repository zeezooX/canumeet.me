import { ApiProperty } from '@nestjs/swagger';
import { GetCommentDto } from '../../../common/dto/get-comment.dto';

export class GetMeetingDto {
  @ApiProperty({ example: 'abc123' })
  publicId: string;

  @ApiProperty({ example: 'Team Standup Meeting' })
  name?: string;

  @ApiProperty({ example: 'Alice' })
  owner: string;

  @ApiProperty({ example: 'Monthly team sync-up' })
  description?: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: '2025-02-20T14:00:00.000Z' })
  date?: Date;

  @ApiProperty({ example: 60 })
  durationMins?: number;

  @ApiProperty({ example: true })
  availabilityEnabled: boolean;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z' })
  availabilityDeadline?: Date;

  @ApiProperty({ example: false })
  commentsEnabled: boolean;

  @ApiProperty({ example: true })
  updatesEnabled: boolean;

  @ApiProperty({ example: false })
  excusesEnabled: boolean;

  @ApiProperty({ example: '2025-02-01T09:00:00.000Z' })
  availabilityStart?: Date;

  @ApiProperty({ example: '2025-02-01T17:00:00.000Z' })
  availabilityEnd?: Date;

  @ApiProperty({ example: 42 })
  userId?: number;

  @ApiProperty({ type: [GetCommentDto] })
  comments?: GetCommentDto[];
}
