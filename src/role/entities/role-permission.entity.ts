import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({ name: 'role_permission' })
export class RolePermission {
  @PrimaryColumn('uuid')
  role_id: string;
  @ManyToOne(() => Role, (role) => role.role_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @PrimaryColumn('uuid')
  permission_id: string;
  @ManyToOne(() => Permission, (permission) => permission.role_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @CreateDateColumn({ select: false })
  created_at: Date;
}
