import { Questionnaire } from '../../questionnaires/entities/questionnaire.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity({ name: 'response' })
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Questionnaire, (questionnaire) => questionnaire.response, {
    onDelete: 'CASCADE',
  })
  questionnaire: Questionnaire;

  @Column({ type: 'jsonb' })
  responses: Array<{ question_id: string; answer: any }>;
}
