import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { PermissionType } from 'src/role/enum/permissions.enum';
import { PermissionGuard } from 'src/guards/permission.guard';
import { DataSource, In } from 'typeorm';
import { CreateResponsesDto } from './dto/create-response.dto';
import { User } from 'src/user/entity/user.entity';
import { Questionnaire } from 'src/questionnaire/entity/questionnaire.entity';
import { ResponseService } from './response.service';
import { Question } from 'src/questionnaire/entity/question.entity';

@Controller('responses')
@UseGuards(JwtAuthGuard)
export class ResponseController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.CREATE_EVENT)
  async createResponse(@Body() payload: CreateResponsesDto) {
    const { user_id, questionnaire_id, responses } = payload;

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: user_id,
      },
    });
    if (!user) throw new BadRequestException('User not found');

    const questionnaire = await this.dataSource
      .getRepository(Questionnaire)
      .findOne({
        where: {
          id: questionnaire_id,
        },
      });
    if (!questionnaire)
      throw new BadRequestException('Questionnaire not found');

    // Validate that every question_id exists in the database
    const question_ids = responses.map((response) => response.question_id);
    const questions = await this.dataSource.getRepository(Question).find({
      where: {
        id: In(question_ids),
      },
    });

    if (question_ids.length !== questions.length) {
      throw new BadRequestException('One or more question_ids are invalid.');
    }

    await this.responseService.createResponse(payload);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_EVENT)
  async getQuestionnaireResponse(@Param('id') id: string) {
    const questionnaire = await this.dataSource
      .getRepository(Questionnaire)
      .findOne({
        where: {
          id,
        },
      });
    if (!questionnaire)
      throw new BadRequestException('Questionnaire not found');
    return await this.responseService.getQuestionnaireResponse(id);
  }
}
