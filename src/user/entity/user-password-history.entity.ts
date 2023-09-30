import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_password_history' })
export class UserPasswordHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;
  @ManyToOne(() => User, (user) => user.user_passwords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;
}
