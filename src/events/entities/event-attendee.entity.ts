import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'event_attendees' })
export class EventAttendee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  event_id: string;
  @ManyToOne(() => Event, (e) => e.event_attendees)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'uuid' })
  attendee_id: string;
  @ManyToOne(() => User, (u) => u.event_attendees)
  @JoinColumn({ name: 'attendee_id' })
  attendee: User;
}
