import { ApiProperty } from '@nestjs/swagger';
import { RangeDto } from './range.dto';

export class GetAvailabilityResponseDto {
  @ApiProperty({ example: 1 })
  availabilityId: number;

  @ApiProperty({ example: 1 })
  meetingId: number;

  @ApiProperty({ example: 'abcdef12' })
  publicId: string;

  @ApiProperty({ example: 'abcdef12ghijkl34' })
  privateId: string;

  @ApiProperty({ example: 'John Doe' })
  owner: string;

  @ApiProperty({ example: 'I am available during these times', required: false })
  message: string;

  @ApiProperty({ type: [RangeDto] })
  ranges: RangeDto[];
}
