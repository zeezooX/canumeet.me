import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * Data transfer object for modifying a meeting
 */
export class ModifyMeetingDto {
  /**
   * Whether availability is enabled for this meeting
   */
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Whether availability is enabled for this meeting',
    example: true,
    required: false,
  })
  availabilityEnabled?: boolean;

  /**
   * Deadline for availability submissions
   */
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'Deadline for availability submissions',
    example: '2025-02-15T10:00:00.000Z',
    required: false,
  })
  availabilityDeadline?: string;

  /**
   * Whether comments are enabled for this meeting
   */
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Whether comments are enabled for this meeting',
    example: false,
    required: false,
  })
  commentsEnabled?: boolean;

  /**
   * Whether updates are enabled for this meeting
   */
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Whether updates are enabled for this meeting',
    example: false,
    required: false,
  })
  updatesEnabled?: boolean;

  /**
   * Whether excuses are enabled for this meeting
   */
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'Whether excuses are enabled for this meeting',
    example: false,
    required: false,
  })
  excusesEnabled?: boolean;

  /**
   * Name of the meeting
   */
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Name of the meeting',
    example: 'Team Sync-Up',
    required: false,
  })
  name?: string;

  /**
   * Description of the meeting in markdown
   */
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Description of the meeting in markdown',
    example: 'Monthly sync-up for project updates and goals',
    required: false,
  })
  description?: string;

  /**
   * Owner of the meeting
   */
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Owner of the meeting',
    example: 'Alice',
    required: false,
  })
  owner: string;

  /**
   * Date of the meeting
   */
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'Date of the meeting',
    example: '2025-02-20T14:00:00.000Z',
    required: false,
  })
  date?: string;

  /**
   * Duration of the meeting in minutes
   */
  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    type: Number,
    description: 'Duration of the meeting in minutes',
    example: 60,
    required: false,
  })
  durationMins?: number;

  /**
   * Start date of availability options
   */
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'Start date for availability options',
    example: '2025-02-10T09:00:00.000Z',
    required: false,
  })
  availabilityStart?: string;

  /**
   * End date of availability options
   */
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    type: Date,
    description: 'End date for availability options',
    example: '2025-02-24T17:00:00.000Z',
    required: false,
  })
  availabilityEnd?: string;
}
