import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from '../../user/entity/user.entity';

@Entity({ name: 'user_role' })
export class UserRole {
  @PrimaryColumn('uuid')
  user_id: string;
  @ManyToOne(() => User, (user) => user.user_roles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn('uuid')
  role_id: string;
  @ManyToOne(() => Role, (role) => role.user_roles)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
