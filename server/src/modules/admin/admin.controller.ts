import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationService } from '../../common/validation.service';
import { AdminService } from './admin.service';
import { GetResponsesDto } from './dto/get-responses.dto';
import { ModifyMeetingDto } from './dto/modify-meeting.dto';

@ApiTags('admin')
@Controller('meeting')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly validationService: ValidationService
  ) {}

  /**
   * Get meeting responses
   * @param privateId - Private ID of the meeting
   * @returns Meeting responses
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Get meeting responses' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Meeting responses', type: GetResponsesDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Get(':privateId/admin')
  async getResponses(@Param('privateId') privateId: string) {
    const publicId = await this.validationService.getPublicId(privateId);
    return this.adminService.getResponses(publicId);
  }

  /**
   * Modify meeting
   * @param privateId - Private ID of the meeting
   * @param modifyMeetingDto - Meeting details to modify
   * @returns Modified meeting
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Modify meeting' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Meeting modified', type: ModifyMeetingDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post(':privateId/admin')
  async modifyMeeting(
    @Body() modifyMeetingDto: ModifyMeetingDto,
    @Param('privateId') privateId: string
  ) {
    const publicId = await this.validationService.getPublicId(privateId);
    return this.adminService.modifyMeeting(publicId, modifyMeetingDto);
  }

  /**
   * Delete meeting
   * @param privateId - Private ID of the meeting
   * @returns Meeting deleted
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Delete meeting' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Meeting deleted' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post(':privateId/delete')
  async deleteMeeting(@Param('privateId') privateId: string) {
    const publicId = await this.validationService.getPublicId(privateId);
    return this.adminService.deleteMeeting(publicId);
  }
}
