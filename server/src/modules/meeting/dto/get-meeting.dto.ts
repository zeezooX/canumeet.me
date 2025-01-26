import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GetMeetingsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(6, { each: true })
  @MaxLength(6, { each: true })
  @ApiProperty({
    type: [String],
    description: 'Public ID(s) of the meeting. Must be an array of strings, each 6 characters long.',
    example: ['000000'],
    required: true,
  })
  publicId: string[];
}
