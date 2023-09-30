import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Question } from './question.entity';
import { Event } from '../../event/entity/event.entity';
import { Response } from '../../response/entity/response.entity';

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
  @ManyToOne(() => Event, (e) => e.questionnaires, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @OneToMany(() => Response, (response) => response.questionnaire, {
    cascade: true,
  })
  responses: Response[];
}
