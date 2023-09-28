import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import {
  CreateQuestionDto,
  CreateQuestionnaireDto,
} from './dto/create-questionnaire.dto';
import { Question } from './entities/question.entity';
import { Questionnaire } from './entities/questionnaire.entity';

@Injectable()
export class QuestionnairesService {
  constructor(private readonly dataSource: DataSource) {}

  async createQuestionnaire(payload: CreateQuestionnaireDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title, description, questions, event_id } = payload;

      const questionnaire = await this.createQuestionnaireRecord(
        queryRunner,
        title,
        description,
        event_id,
      );
      const savedQuestions = await this.createQuestions(
        queryRunner,
        questions,
        questionnaire.id,
      );

      await queryRunner.commitTransaction();
      return {
        questionnaire,
        questions: savedQuestions,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async createQuestionnaireRecord(
    queryRunner: QueryRunner,
    title: string,
    description: string,
    event_id: string,
  ) {
    return queryRunner.manager.getRepository('questionnaire').save({
      title,
      description,
      event_id,
    });
  }

  private async createQuestions(
    queryRunner: QueryRunner,
    questions: CreateQuestionDto[],
    questionnaire_id: string,
  ) {
    const questionsToSave = questions.map((question) => ({
      ...question,
      questionnaire_id: questionnaire_id,
    }));
    return queryRunner.manager.getRepository(Question).save(questionsToSave);
  }

  async deleteQuestionnaire(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(Questionnaire).delete(id);
      return { message: 'Questionnaire deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
