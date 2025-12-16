import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAvailabilityResponseDto } from '../../common/dto/get-availability-response.dto';
import { ValidationService } from '../../common/validation.service';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';

@ApiTags('availability')
@Controller('meeting')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly validationService: ValidationService
  ) {}

  /**
   * Create availability for a meeting
   * @param meetingPublicId - Public ID of the meeting
   * @param availabilityDto - Availability details
   * @returns IDs of the availability
   * @throws Invalid request
   */
  @ApiOperation({ summary: 'Create availability' })
  @ApiParam({
    name: 'meetingPublicId',
    type: String,
    description: 'Public ID of the meeting',
    example: '000000',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Availability created',
    type: GetAvailabilityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:meetingPublicId/available')
  async createAvailability(
    @Body() availabilityDto: AvailabilityDto,
    @Param('meetingPublicId') meetingPublicId: string
  ) {
    return this.availabilityService.createAvailability(meetingPublicId, availabilityDto);
  }

  /**
   * Get availability
   * @param privateId - Private ID of the availability
   * @returns Availability details
   */
  @ApiOperation({ summary: 'Get availability' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the availability',
    example: '00000000abcdefgh',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Availability details',
    type: GetAvailabilityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Get('/:meetingPublicId/available/:privateId')
  async getAvailability(@Param('privateId') privateId: string) {
    const publicId = await this.validationService.getPublicId(privateId, 16);
    return this.availabilityService.getAvailability(publicId);
  }

  /**
   * Modify availability
   * @param privateId - Private ID of the availability
   * @param availabilityDto - Availability details to modify
   * @returns Availability modified
   */
  @ApiOperation({ summary: 'Modify availability' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the availability',
    example: '00000000abcdefgh',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Availability modified',
    type: GetAvailabilityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('/:meetingPublicId/available/:privateId')
  async modifyAvailability(
    @Body() availabilityDto: AvailabilityDto,
    @Param('privateId') privateId: string
  ) {
    const publicId = await this.validationService.getPublicId(privateId, 16);
    return this.availabilityService.modifyAvailability(publicId, availabilityDto);
  }
}
