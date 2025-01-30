import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationService } from '../../common/validation.service';

@Controller('meeting')
@ApiTags('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly validationService: ValidationService,
  ) {}

  /**
   * Create availability for a meeting
   * @param meetingPublicId - Public ID of the meeting
   * @param availabilityDto - Availability details
   * @returns IDs of the availability
   * @throws Invalid request
   */
  @Post('/:meetingPublicId/available')
  @ApiOperation({ summary: 'Create availability' })
  @ApiResponse({ status: 201, description: 'Availability created' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'meetingPublicId',
    type: String,
    description: 'Public ID of the meeting',
    example: '000000',
    required: true,
  })
  async createAvailability(
    @Param('meetingPublicId') meetingPublicId: string,
    @Body() availabilityDto: AvailabilityDto,
  ) {
    return this.availabilityService.createAvailability(
      meetingPublicId,
      availabilityDto,
    );
  }

  /**
   * Get availability
   * @param privateId - Private ID of the availability
   * @returns Availability details
   */
  @Get('/:meetingPublicId/available/:privateId')
  @ApiOperation({ summary: 'Get availability' })
  @ApiResponse({ status: 200, description: 'Availability details' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the availability',
    example: '00000000abcdefgh',
    required: true,
  })
  async getAvailability(
    @Param('privateId') privateId: string,
  ) {
    const publicId = await this.validationService.getPublicId(
      privateId,
    );
    return this.availabilityService.getAvailability(publicId);
  }

  /**
   * Modify availability
   * @param privateId - Private ID of the availability
   * @param availabilityDto - Availability details to modify
   * @returns Availability modified
   */
  @Post('/:meetingPublicId/available/:privateId')
  @ApiOperation({ summary: 'Modify availability' })
  @ApiResponse({ status: 201, description: 'Availability modified' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiParam({
    name: 'privateId',
    type: String,
    description: 'Private ID of the availability',
    example: '00000000abcdefgh',
    required: true,
  })
  async modifyAvailability(
    @Param('privateId') privateId: string,
    @Body() availabilityDto: AvailabilityDto,
  ) {
    const publicId = await this.validationService.getPublicId(
      privateId,
    );
    return this.availabilityService.modifyAvailability(
      publicId,
      availabilityDto,
    );
  }
}
