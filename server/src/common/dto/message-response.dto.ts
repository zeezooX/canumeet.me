import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    example: 'Operation successful',
    description: 'Response message',
  })
  message: string;
}
