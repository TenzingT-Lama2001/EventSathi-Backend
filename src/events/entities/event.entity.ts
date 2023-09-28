import { SpeakerEvent } from '../../speakers/entities/speaker-event.entity';
import { User } from '../../users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EventAttendee } from './event-attendee.entity';

export enum EventLocationType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}
export enum EventStatus {
  UPCOMING = 'UPCOMING',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
}

export interface EventAgenda {
  title: string;
  time: Date;
  speaker: string;
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organization: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  event_image: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ type: 'integer', nullable: true })
  max_attendees: number;

  @Column({ type: 'timestamp', nullable: true })
  registration_deadline: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column({
    type: 'enum',
    enum: EventLocationType,
    default: EventLocationType.ONLINE,
  })
  event_location_type: EventLocationType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  event_link: string;

  @OneToMany(() => SpeakerEvent, (se) => se.event, { cascade: true })
  speaker_events: SpeakerEvent[];

  @Column({ type: 'uuid' })
  organizer_id: string;
  @JoinColumn({ name: 'organizer_id' })
  @ManyToOne(() => User, (u) => u.events)
  organizer: User;

  @OneToMany(() => EventAttendee, (ea) => ea.event)
  event_attendees: EventAttendee[];

  @Column({ type: 'json', nullable: true, default: [] })
  agenda: EventAgenda[]; // You can structure the agenda data as needed

  /**const agendaData = [
  {
    title: 'Session 1',
    time: '2023-10-20T09:00:00Z',
    speaker: 'John Smith',
  },
  {
    title: 'Session 2',
    time: '2023-10-20T11:00:00Z',
    speaker: 'Jane Doe',
  },
  // Add more sessions as needed
];
 */
}
