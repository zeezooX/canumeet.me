import { ApiProperty } from '@nestjs/swagger';

class GetRangeDto {
  @ApiProperty({ example: 1 })
  rangeId: number;

  @ApiProperty({ example: 1 })
  availabilityId: number;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2025-01-15T12:00:00.000Z' })
  endTime: Date;
}

export class GetAvailabilityDto {
  @ApiProperty({ example: 'abc123' })
  meetingId: string;

  @ApiProperty({ example: 'abcdef12' })
  publicId: string;

  @ApiProperty({ example: 'abcdef12ghijkl34' })
  privateId: string;

  @ApiProperty({ example: 'John Doe' })
  owner: string;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'I am available during these times' })
  message?: string;

  @ApiProperty({ example: 42 })
  userId?: number;

  @ApiProperty({ type: [GetRangeDto] })
  ranges: GetRangeDto[];
}
