import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { GetMeetingsDto } from './dto/get-meeting.dto';

@Controller('meeting')
@ApiTags('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  async getMeetings(@Query() query: GetMeetingsDto) {
    // TODO: Implement the logic to get meetings
  }
}
