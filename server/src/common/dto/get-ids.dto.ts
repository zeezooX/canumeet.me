import { ApiProperty } from '@nestjs/swagger';

export class GetIdsDto {
  @ApiProperty({ example: 'abc123' })
  publicId: string;

  @ApiProperty({ example: 'abc123def456' })
  privateId: string;
}
