import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@Controller('meeting')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

}
