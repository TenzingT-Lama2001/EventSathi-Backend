import { OTP } from '../../otp/entity/otp.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPasswordHistory } from './user-password-history.entity';
import { ActivityLog } from '../../activity-log/entities/activity-log.entity';
import { Role } from '../../role/entity/role.entity';
import { UserRole } from '../../role/entity/user-role.entity';
import { Event } from '../../event/entity/event.entity';
import { EventAttendee } from '../../event/entity/event-attendee.entity';
import { Response } from '../../response/entity/response.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  education_qualification: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ select: false, nullable: true })
  password: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany(() => OTP, (otp) => otp.user)
  otps: OTP[];

  @OneToMany(() => UserPasswordHistory, (d) => d.user)
  user_passwords: UserPasswordHistory[];

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => Role, (role) => role.creator)
  roles: Role[];

  @OneToMany(() => UserRole, (user_role) => user_role.role, {
    cascade: true,
  })
  user_roles: UserRole[];

  @OneToMany(() => Event, (e) => e.organizer)
  events: Event[];

  @OneToMany(() => EventAttendee, (ea) => ea.attendee)
  event_attendees: EventAttendee[];

  @OneToMany(() => Response, (r) => r.user, {
    cascade: true,
  })
  responses: Response[];
}
