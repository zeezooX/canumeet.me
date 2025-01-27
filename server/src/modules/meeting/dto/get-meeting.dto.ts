import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for getting meeting details
 */
export class GetMeetingsDto {
  /**
   * Public ID(s) of the meeting. Must be an array of strings, each 6 characters long.
   */
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(6, { each: true })
  @MaxLength(6, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty({
    type: [String],
    description:
      'Public ID(s) of the meeting. Must be an array of strings, each 6 characters long.',
    example: ['000000'],
    required: true,
  })
  publicId: string[];
}
