import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('uuid')
  creator_id: string;
  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  // relations
  @OneToMany(() => RolePermission, (role_permission) => role_permission.role, {
    cascade: true,
  })
  role_permissions: RolePermission[];

  @OneToMany(() => UserRole, (user_role) => user_role.role, {
    cascade: true,
  })
  user_roles: UserRole[];
}
