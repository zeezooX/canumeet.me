import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * Data transfer object for availability range
 */
class AvailabilityRangeDto {
  /**
   * Start time of the availability range
   */
  @ApiProperty({
    type: Date,
    description: 'Start time of the availability range',
    example: '2025-02-25T10:00:00.000Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  /**
   * End time of the availability range
   */
  @ApiProperty({
    type: Date,
    description: 'End time of the availability range',
    example: '2025-02-25T14:00:00.000Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}

/**
 * Data transfer object for availability
 */
export class AvailabilityDto {
  /**
   * Owner of the availability
   */
  @ApiProperty({
    type: String,
    description: 'Owner of the availability',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  owner: string;

  /**
   * Message for the availability
   */
  @ApiProperty({
    type: String,
    description: 'Message for the availability',
    example: 'I am available',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * Availability ranges
   */
  @ApiProperty({
    type: [AvailabilityRangeDto],
    description: 'Availability ranges',
    required: true,
  })
  @IsArray()
  @Type(() => AvailabilityRangeDto)
  @ValidateNested({ each: true })
  ranges: AvailabilityRangeDto[];
}
