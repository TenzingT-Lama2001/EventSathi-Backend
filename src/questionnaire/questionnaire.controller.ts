import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { PermissionType } from 'src/role/enum/permissions.enum';
import { PermissionGuard } from 'src/guards/permission.guard';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { DataSource } from 'typeorm';
import { Event } from 'src/event/entity/event.entity';

@Controller('questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(
    private readonly questionnairesService: QuestionnaireService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.CREATE_EVENT)
  async createQuestionnaire(@Body() payload: CreateQuestionnaireDto) {
    const event = await this.dataSource.getRepository(Event).findOne({
      where: {
        id: payload.event_id,
      },
    });
    if (!event) throw new BadRequestException('Event not found');
    return await this.questionnairesService.createQuestionnaire(payload);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_EVENT)
  async getEventQuestionnaire(@Param('id') id: string) {
    const event = await this.dataSource.getRepository(Event).findOne({
      where: {
        id,
      },
    });
    if (!event) throw new BadRequestException('Event not found');
    return await this.questionnairesService.getEventQuestionnaire(id);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.DELETE_EVENT)
  deleteQuestionnaire(@Param('id') id: string) {
    return this.questionnairesService.deleteQuestionnaire(id);
  }
}
