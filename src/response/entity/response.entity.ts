import { User } from '../../user/entity/user.entity';
import { Questionnaire } from '../../questionnaire/entity/questionnaire.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'response' })
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;
  @ManyToOne(() => User, (user) => user.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  questionnaire_id: string;
  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;

  @Column({ type: 'jsonb' })
  responses: Array<{ question_id: string; answer: any }>;
}
