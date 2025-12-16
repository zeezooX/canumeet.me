import { ApiProperty } from '@nestjs/swagger';

export class IdsResponseDto {
  @ApiProperty({
    example: 'abc123',
    description: 'Public ID',
  })
  publicId: string;

  @ApiProperty({
    example: 'abc123def456',
    description: 'Private ID',
  })
  privateId: string;
}
