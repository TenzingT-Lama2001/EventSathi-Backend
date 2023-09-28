import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Speaker } from './speaker.entity';
import { Event } from '../../events/entities/event.entity';

@Entity({ name: 'speaker_events' })
export class SpeakerEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  speaker_id: string;
  @ManyToOne(() => Speaker, (s) => s.speaker_events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'speaker_id' })
  speaker: Speaker;

  @Column({ type: 'uuid' })
  event_id: string;
  @ManyToOne(() => Event, (e) => e.speaker_events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
