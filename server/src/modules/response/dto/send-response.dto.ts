import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * Data transfer object for sending a response (comment/update/excuse)
 */
export class SendResponseDto {
  /**
   * Owner of the response (comment/update/excuse)
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Owner of the response (comment/update/excuse)',
    example: 'Doe',
    required: true,
  })
  owner: string;

  /**
   * Message of the response (comment/update/excuse)
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Message of the response (comment/update/excuse)',
    example: 'Can you post the slides?',
    required: true,
  })
  message: string;
}
