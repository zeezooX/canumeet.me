import { ApiProperty } from '@nestjs/swagger';

export class RangeDto {
  @ApiProperty({ example: 1 })
  rangeId: number;

  @ApiProperty({ example: 1 })
  availabilityId: number;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  start: Date;

  @ApiProperty({ example: '2025-01-15T12:00:00.000Z' })
  end: Date;
}
