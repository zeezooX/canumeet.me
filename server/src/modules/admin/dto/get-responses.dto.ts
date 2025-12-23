import { ApiProperty } from '@nestjs/swagger';
import { GetAvailabilityDto } from '../../../common/dto/get-availability.dto';
import { GetCommentDto } from '../../../common/dto/get-comment.dto';

class GetExcuseDto {
  @ApiProperty({ example: 1 })
  excuseId: number;

  @ApiProperty({ example: 'abc123' })
  meetingId: string;

  @ApiProperty({ example: 'Jane Doe' })
  owner: string;

  @ApiProperty({ example: 'Sorry, I cannot attend' })
  message: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;
}

export class GetResponsesDto {
  @ApiProperty({ example: 'abc123' })
  publicId: string;

  @ApiProperty({ example: 'abc123def456' })
  privateId: string;

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

  @ApiProperty({ type: [GetAvailabilityDto] })
  availabilities: GetAvailabilityDto[];

  @ApiProperty({ type: [GetExcuseDto] })
  excuses: GetExcuseDto[];

  @ApiProperty({ type: [GetCommentDto] })
  comments: GetCommentDto[];
}
