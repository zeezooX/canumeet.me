import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { GetMeetingsDto } from './dto/get-meeting.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Controller('meeting')
@ApiTags('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  /**
   * Get meeting details
   * @param query - Public ID(s) of the meeting. Must be an array of strings, each 6 characters long.
   * @returns Meeting details
   * @throws Invalid request
   */
  @Get()
  @ApiOperation({ summary: 'Get meeting details' })
  @ApiResponse({ status: 200, description: 'Meeting details' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async getMeetings(@Query() query: GetMeetingsDto) {
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
  @Post('create')
  @ApiOperation({ summary: 'Create a meeting' })
  @ApiResponse({ status: 201, description: 'Created meeting' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async createMeeting(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.createMeeting(createMeetingDto);
  }
}
