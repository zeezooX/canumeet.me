import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetIdsDto } from 'src/common/dto/get-ids.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { GetMeetingDto } from './dto/get-meeting.dto';
import { GetMeetingsParamsDto } from './dto/get-meetings-params.dto';
import { MeetingService } from './meeting.service';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  /**
   * Get meeting details
   * @param query - Public ID(s) of the meeting. Must be an array of strings, each 6 characters long.
   * @returns Meeting details
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Get meeting details' })
  @ApiResponse({
    status: 200,
    description: 'Meeting details',
    type: GetMeetingDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Get()
  async getMeetings(@Query() query: GetMeetingsParamsDto) {
    if (typeof query.publicId === 'string') {
      query.publicId = [query.publicId];
    }

    const meetings = await this.meetingService.getMeetings(query.publicId);

    if (meetings.length === 0) {
      throw new BadRequestException('Meeting not found');
    }

    return meetings;
  }

  /**
   * Create a meeting
   * @param createMeetingDto - Meeting details
   * @returns IDs of the created meeting
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Create a meeting' })
  @ApiResponse({ status: 201, description: 'Created meeting', type: GetIdsDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('create')
  async createMeeting(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.createMeeting(createMeetingDto);
  }
}
