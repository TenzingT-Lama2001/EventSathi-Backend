import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import {
  CreateQuestionDto,
  CreateQuestionnaireDto,
} from './dto/create-questionnaire.dto';
import { Question } from './entity/question.entity';
import { Questionnaire } from './entity/questionnaire.entity';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly dataSource: DataSource) {}

  async createQuestionnaire(payload: CreateQuestionnaireDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title, description, questions, event_id } = payload;
      console.log(
        '🚀 ~ file: questionnaires.service.ts:21 ~ QuestionnairesService ~ createQuestionnaire ~ payload:',
        payload,
      );

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
    return queryRunner.manager.getRepository(Questionnaire).save({
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
    console.log(
      '🚀 ~ file: questionnaires.service.ts:69 ~ QuestionnairesService ~ questions:',
      questions,
    );
    const questionsToSave = questions.map((question) => ({
      ...question,
      questionnaire_id: questionnaire_id,
    }));
    return queryRunner.manager.getRepository(Question).save(questionsToSave);
  }

  async getQuestionnaire(id: string) {
    return this.dataSource.getRepository(Questionnaire).findOne({
      where: { event_id: id },
      relations: {
        questions: true,
      },
    });
  }
  async deleteQuestionnaire(id: string) {
    console.log(
      '🚀 ~ file: questionnaires.service.ts:89 ~ QuestionnairesService ~ deleteQuestionnaire ~ id:',
      id,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(Questionnaire).findOne({
        where: {
          event_id: id,
        },
      });

      const result = await queryRunner.manager
        .getRepository(Questionnaire)
        .delete({ event_id: id });

      if (result.affected === 0) {
        throw new BadRequestException('No questionnaires were deleted.');
      }
      await queryRunner.commitTransaction();
      return { message: 'Questionnaire deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getEventQuestionnaire(id: string) {
    const questionnaire = await this.dataSource
      .getRepository(Questionnaire)
      .findOne({
        where: {
          event_id: id,
        },
      });
    if (!questionnaire)
      throw new BadRequestException('Questionnaire not found');
    return questionnaire;
  }
}
