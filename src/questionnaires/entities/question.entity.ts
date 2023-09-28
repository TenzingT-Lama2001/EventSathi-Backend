import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Questionnaire } from './questionnaire.entity';

export enum QuestionType {
  LONG_ANSWER = 'LONG_ANSWER',
  SHORT_ANSWER = 'SHORT_ANSWER',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOXES = 'CHECKBOXES',
  DROPDOWN = 'DROPDOWN',
}
@Entity({ name: 'question' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question_text: string; // The question text

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType; // Question type

  @Column('json', { nullable: true })
  options: string[]; // Array of options for multiple-choice and checkboxes

  @Column({ type: 'uuid' })
  questionnaire_id: string;
  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;
}
