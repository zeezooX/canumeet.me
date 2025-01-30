import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ModifyMeetingDto } from './dto/modify-meeting.dto';
import { ValidationService } from '../../common/validation.service';

@Controller('meeting')
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly validationService: ValidationService,
  ) {}

  /**
   * Get meeting responses
   * @param privateId - Private ID of the meeting
   * @returns Meeting responses
   * @throws Invalid request
   */
  @Get(':privateId/admin')
  @ApiOperation({ summary: 'Get meeting responses' })
  @ApiResponse({ status: 200, description: 'Meeting responses' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
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
  @Post(':privateId/admin')
  @ApiOperation({ summary: 'Modify meeting' })
  @ApiResponse({ status: 201, description: 'Meeting modified' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  async modifyMeeting(
    @Param('privateId') privateId: string,
    @Body() modifyMeetingDto: ModifyMeetingDto,
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
  @Post(':privateId/delete')
  @ApiOperation({ summary: 'Delete meeting' })
  @ApiResponse({ status: 201, description: 'Meeting deleted' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the meeting',
    example: '000000abcdef',
    required: true,
  })
  async deleteMeeting(@Param('privateId') privateId: string) {
    const publicId = await this.validationService.getPublicId(privateId);
    return this.adminService.deleteMeeting(publicId);
  }
}
