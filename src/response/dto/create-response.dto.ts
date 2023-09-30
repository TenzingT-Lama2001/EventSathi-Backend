import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

type Response = {
  question_id: string;
  answer: any;
};

export class CreateResponsesDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  questionnaire_id: string;

  @IsArray()
  @ArrayNotEmpty()
  responses: Response[];
}
