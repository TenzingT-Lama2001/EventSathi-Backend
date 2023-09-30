import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SpeakerEvent } from './speaker-event.entity';

@Entity('speakers')
export class Speaker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @OneToMany(() => SpeakerEvent, (se) => se.speaker, { onDelete: 'CASCADE' })
  speaker_events: SpeakerEvent[];
}
