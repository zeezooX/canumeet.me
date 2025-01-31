import { Controller, Param, Post, Body } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ValidationService } from '../../common/validation.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendResponseDto } from './dto/send-response.dto';

@Controller('meeting')
@ApiTags('response')
export class ResponseController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService,
  ) {}

  /**
   * Send excuse for a meeting
   * @param publicId - Public ID of the meeting
   * @param sendResponseDto - Excuse details
   * @throws Invalid request
   * @returns Excuse sent
   */
  @Post('/:publicId/excuse')
  @ApiOperation({ summary: 'Send excuse for a meeting' })
  @ApiResponse({ status: 201, description: 'Excuse sent' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'publicId',
    type: String,
    description: 'Public ID of the meeting',
    example: '000000',
    required: true,
  })
  async sendExcuse(
    @Param('publicId') publicId: string,
    @Body() sendResponseDto: SendResponseDto,
  ) {
    return this.responseService.sendExcuse(publicId, sendResponseDto);
  }

  /**
   * Send comment for a meeting
   * @param meetingId - Meeting ID, public if normal comment or private if admin comment
   * @param sendResponseDto - Comment details
   * @throws Invalid request
   * @returns Comment sent
   */
  @Post('/:meetingId/comment')
  @ApiOperation({ summary: 'Send comment for a meeting' })
  @ApiResponse({ status: 201, description: 'Comment sent' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'meetingId',
    type: String,
    description: 'Meeting ID, public if normal comment or private if admin comment',
    example: '000000',
    required: true,
  })
  async sendComment(
    @Param('meetingId') meetingId: string,
    @Body() sendResponseDto: SendResponseDto,
  ) {
    if (meetingId.length === 6) {
      return this.responseService.sendComment(meetingId, sendResponseDto);
    }

    const publicId = await this.validationService.getPublicId(meetingId, 12);
    return this.responseService.sendComment(publicId, sendResponseDto, null, true);
  }

  /**
   * Send reply for a comment
   * @param meetingId - Meeting ID, public if normal comment or private if admin comment
   * @param parentId - Parent comment ID to reply to
   * @param sendResponseDto - Reply details
   * @throws Invalid request
   * @returns Reply sent
   */
  @Post('/:meetingId/comment/:parentId')
  @ApiOperation({ summary: 'Send reply for a comment' })
  @ApiResponse({ status: 201, description: 'Reply sent' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'meetingId',
    type: String,
    description: 'Meeting ID, public if normal comment or private if admin comment',
    example: '000000',
    required: true,
  })
  @ApiParam({
    name: 'parentId',
    type: Number,
    description: 'Parent comment ID to reply to',
    example: 1,
    required: true,
  })
  async sendReply(
    @Param('meetingId') meetingId: string,
    @Param('parentId') parentId: number,
    @Body() sendResponseDto: SendResponseDto,
  ) {
    if (meetingId.length === 6) {
      return this.responseService.sendComment(meetingId, sendResponseDto, parentId);
    }

    const publicId = await this.validationService.getPublicId(meetingId, 12);
    return this.responseService.sendComment(publicId, sendResponseDto, parentId, true);
  }

  /**
   * Send an update about a meeting
   * @param privateId - Private ID of the meeting
   * @param sendResponseDto - Update details
   * @throws Invalid request
   * @returns Update sent
   */
  @Post('/:privateId/update')
  @ApiOperation({ summary: 'Send an update about a meeting' })
  @ApiResponse({ status: 201, description: 'Update sent' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  async updateResponse(
    @Param('privateId') privateId: string,
    @Body() sendResponseDto: SendResponseDto,
  ) {
    const publicId = await this.validationService.getPublicId(privateId, 12);
    return this.responseService.sendComment(publicId, sendResponseDto, null, false, true);
  }
}
