import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Event } from '../../events/entities/event.entity';
import { Response } from 'src/responses/entities/response.entity';

@Entity({ name: 'questionnaire' })
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Question, (question) => question.questionnaire, {
    cascade: true,
  })
  questions: Question[];

  @Column({ type: 'uuid' })
  event_id: string;
  @JoinColumn({ name: 'event_id' })
  @OneToOne(() => Event, (e) => e.questionnaire, {
    onDelete: 'CASCADE',
  })
  event: Event[];

  @OneToOne(() => Response, (response) => response.questionnaire, {
    cascade: true,
  })
  response: Response;
}
