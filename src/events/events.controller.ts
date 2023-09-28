import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { PermissionType } from 'src/role/enum/permissions.enum';
import { PermissionGuard } from 'src/guards/permission.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { IExtendedUser } from 'src/shared/extended-user.interface';
import { CreateSpeakerDto } from 'src/speakers/dto/create-speaker.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.CREATE_EVENT)
  async createEvent(
    @GetUser() user: IExtendedUser,
    @Body('event') createEventDto: CreateEventDto,
    @Body('speakers') createSpeakerDto: CreateSpeakerDto[],
  ) {
    return await this.eventsService.createEvent(
      user.id,
      createEventDto,
      createSpeakerDto,
    );
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_EVENT)
  getEvent(@Param('id') id: string) {
    return this.eventsService.getEvent(id);
  }
  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_ALL_EVENT)
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.UPDATE_EVENT)
  update(@Param('id') id: string) {
    return this.eventsService.update(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.DELETE_EVENT)
  removeEvent(@Param('id') id: string) {
    return this.eventsService.removeEvent(id);
  }
}
