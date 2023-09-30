import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateResponsesDto } from './dto/create-response.dto';
import { Response } from './entity/response.entity';

@Injectable()
export class ResponseService {
  constructor(private readonly dataSource: DataSource) {}

  async createResponse(payload: CreateResponsesDto) {
    await this.dataSource.getRepository(Response).save(payload);
  }

  async getQuestionnaireResponse(id: string) {
    return this.dataSource.getRepository(Response).findOne({
      where: {
        questionnaire_id: id,
      },
      relations: {
        questionnaire: {
          questions: true,
        },
      },
    });
  }
}
