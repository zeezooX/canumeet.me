import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { IsBefore } from 'src/common/is-before.decorator';

/**
 * Data transfer object for modifying a meeting
 */
export class UpdateMeetingDto {
  /**
   * Whether availability is enabled for this meeting
   */
  @ApiProperty({
    type: Boolean,
    description: 'Whether availability is enabled for this meeting',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  availabilityEnabled?: boolean;

  /**
   * Deadline for availability submissions
   */
  @ApiProperty({
    type: Date,
    description: 'Deadline for availability submissions',
    example: '2025-02-15T10:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @IsBefore('availabilityStart')
  availabilityDeadline?: string;

  /**
   * Whether comments are enabled for this meeting
   */
  @ApiProperty({
    type: Boolean,
    description: 'Whether comments are enabled for this meeting',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  commentsEnabled?: boolean;

  /**
   * Whether updates are enabled for this meeting
   */
  @ApiProperty({
    type: Boolean,
    description: 'Whether updates are enabled for this meeting',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  updatesEnabled?: boolean;

  /**
   * Whether excuses are enabled for this meeting
   */
  @ApiProperty({
    type: Boolean,
    description: 'Whether excuses are enabled for this meeting',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  excusesEnabled?: boolean;

  /**
   * Name of the meeting
   */
  @ApiProperty({
    type: String,
    description: 'Name of the meeting',
    example: 'Team Sync-Up',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Description of the meeting in markdown
   */
  @ApiProperty({
    type: String,
    description: 'Description of the meeting in markdown',
    example: 'Monthly sync-up for project updates and goals',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Owner of the meeting
   */
  @ApiProperty({
    type: String,
    description: 'Owner of the meeting',
    example: 'Alice',
    required: false,
  })
  @IsOptional()
  @IsString()
  owner: string;

  /**
   * Date of the meeting
   */
  @ApiProperty({
    type: Date,
    description: 'Date of the meeting',
    example: '2025-02-20T14:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  /**
   * Duration of the meeting in minutes
   */
  @ApiProperty({
    type: Number,
    description: 'Duration of the meeting in minutes',
    example: 60,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @IsPositive()
  durationMins?: number;

  /**
   * Start date of availability options
   */
  @ApiProperty({
    type: Date,
    description: 'Start date for availability options',
    example: '2025-02-10T09:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @IsBefore('availabilityEnd')
  availabilityStart?: string;

  /**
   * End date of availability options
   */
  @ApiProperty({
    type: Date,
    description: 'End date for availability options',
    example: '2025-02-24T17:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  availabilityEnd?: string;
}
