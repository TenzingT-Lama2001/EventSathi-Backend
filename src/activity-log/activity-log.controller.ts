import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { IExtendedUser } from 'src/shared/extended-user.interface';
import { Request } from 'express';

@ApiTags('activity-log')
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ApiOperation({ summary: 'Create activity log' })
  @Post()
  create(
    @Body() createActivityLogDto: CreateActivityLogDto,
    @GetUser() user: IExtendedUser,
    @Req() req: Request,
  ) {
    return this.activityLogService.create(
      createActivityLogDto,
      user.id,
      req.ip,
    );
  }

  @ApiOperation({ summary: 'Get my activity log' })
  @Get()
  findMyLogs(@GetUser() user: IExtendedUser) {
    return this.activityLogService.findMyLogs(user.id);
  }
}
