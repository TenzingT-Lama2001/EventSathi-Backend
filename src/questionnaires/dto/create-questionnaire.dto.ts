import { QuestionType } from '../entities/question.entity';

export class CreateQuestionDto {
  question_text: string;
  type: QuestionType;
  options: string[];
}
export class CreateQuestionnaireDto {
  title: string;
  description: string;
  event_id: string;
  questions: CreateQuestionDto[];
}
