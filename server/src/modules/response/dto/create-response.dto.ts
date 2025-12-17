import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object for sending a response (comment/update/excuse)
 */
export class CreateResponseDto {
  /**
   * Owner of the response (comment/update/excuse)
   */
  @ApiProperty({
    type: String,
    description: 'Owner of the response (comment/update/excuse)',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  owner: string;

  /**
   * Message of the response (comment/update/excuse)
   */
  @ApiProperty({
    type: String,
    description: 'Message of the response (comment/update/excuse)',
    example: 'Can you post the slides?',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
