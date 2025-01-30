import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for availability range
 */
class AvailabilityRangeDto {
  /**
   * Start time of the availability range
   */
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: 'Start time of the availability range',
    example: '2025-02-25T10:00:00.000Z',
    required: true,
  })
  startTime: string;

  /**
   * End time of the availability range
   */
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: 'End time of the availability range',
    example: '2025-02-25T14:00:00.000Z',
    required: true,
  })
  endTime: string;
}

/**
 * Data transfer object for availability
 */
export class AvailabilityDto {
  /**
   * Owner of the availability
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Owner of the availability',
    example: 'Doe',
    required: true,
  })
  owner: string;

  /**
   * Message for the availability
   */
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Message for the availability',
    example: 'I am available',
    required: false,
  })
  message?: string;

  /**
   * Availability ranges
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRangeDto)
  @ApiProperty({
    type: [AvailabilityRangeDto],
    description: 'Availability ranges',
    required: true,
  })
  ranges: AvailabilityRangeDto[];
}
