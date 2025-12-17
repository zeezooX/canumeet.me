import { ApiProperty } from '@nestjs/swagger';

export class GetCommentDto {
  @ApiProperty({ example: 1 })
  commentId: number;

  @ApiProperty({ example: 1 })
  meetingId: number;

  @ApiProperty({ example: 1 })
  parentId?: number;

  @ApiProperty({ example: 'John Doe' })
  owner: string;

  @ApiProperty({ example: 'Looking forward to this meeting!' })
  message: string;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty({ example: false })
  isUpdate: boolean;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
  createdAt: Date;
}
