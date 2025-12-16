import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { ValidationService } from '../../common/validation.service';
import { SendResponseDto } from './dto/send-response.dto';
import { ResponseService } from './response.service';

@ApiTags('response')
@Controller('meeting')
export class ResponseController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly validationService: ValidationService
  ) {}

  /**
   * Send excuse for a meeting
   * @param publicId - Public ID of the meeting
   * @param sendResponseDto - Excuse details
   * @throws Invalid request
   * @returns Excuse sent
   */
  @ApiOperation({ summary: 'Send excuse for a meeting' })
  @ApiParam({
    name: 'publicId',
    type: String,
    description: 'Public ID of the meeting',
    example: '000000',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Excuse sent', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:publicId/excuse')
  async sendExcuse(@Body() sendResponseDto: SendResponseDto, @Param('publicId') publicId: string) {
    return this.responseService.sendExcuse(publicId, sendResponseDto);
  }

  /**
   * Send comment for a meeting
   * @param meetingId - Meeting ID, public if normal comment or private if admin comment
   * @param sendResponseDto - Comment details
   * @throws Invalid request
   * @returns Comment sent
   */
  @ApiOperation({ summary: 'Send comment for a meeting' })
  @ApiParam({
    name: 'meetingId',
    type: String,
    description: 'Meeting ID, public if normal comment or private if admin comment',
    example: '000000',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Comment sent', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:meetingId/comment')
  async sendComment(
    @Body() sendResponseDto: SendResponseDto,
    @Param('meetingId') meetingId: string
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
  @ApiOperation({ summary: 'Send reply for a comment' })
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
  @ApiResponse({ status: 201, description: 'Reply sent', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:meetingId/comment/:parentId')
  async sendReply(
    @Body() sendResponseDto: SendResponseDto,
    @Param('meetingId') meetingId: string,
    @Param('parentId') parentId: number
  ) {
    parentId = parseInt(parentId.toString(), 10);

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
  @ApiOperation({ summary: 'Send an update about a meeting' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Update sent', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:privateId/update')
  async updateResponse(
    @Body() sendResponseDto: SendResponseDto,
    @Param('privateId') privateId: string
  ) {
    const publicId = await this.validationService.getPublicId(privateId, 12);
    return this.responseService.sendComment(publicId, sendResponseDto, null, false, true);
  }
}
