import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    createActivityLogDto: CreateActivityLogDto,
    userId: string,
    ip_address: string,
  ) {
    await this.dataSource.getRepository(ActivityLog).save({
      ip_address,
      userId,
      ...createActivityLogDto,
    });
  }

  async findMyLogs(user: string) {
    return await this.dataSource.getRepository(ActivityLog).find({
      where: { user: { id: user } },
    });
  }
}
