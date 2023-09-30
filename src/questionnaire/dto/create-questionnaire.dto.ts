import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../entity/question.entity';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @ApiProperty({ type: 'text', example: 'Description of event 1' })
  @IsNotEmpty()
  @IsString()
  question_text: string;

  @ApiProperty({ type: 'string', example: QuestionType.MULTIPLE_CHOICE })
  @IsEnum(QuestionType)
  @IsIn([
    QuestionType.CHECKBOXES,
    QuestionType.DROPDOWN,
    QuestionType.LONG_ANSWER,
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.SHORT_ANSWER,
  ])
  type: QuestionType;

  @IsArray()
  @IsOptional()
  options: string[];
}
export class CreateQuestionnaireDto {
  @ApiProperty({ type: 'string', example: 'Event 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ type: 'text', example: 'Description of event 1' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  event_id: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
