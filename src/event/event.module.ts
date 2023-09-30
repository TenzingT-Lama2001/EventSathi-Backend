import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
