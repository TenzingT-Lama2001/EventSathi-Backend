import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PermissionCategory } from './permission-category.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  permission_category_id: string;
  @ManyToOne(
    () => PermissionCategory,
    (permission_category) => permission_category.permissions,
  )
  @JoinColumn({ name: 'permission_category_id' })
  permission_category: PermissionCategory;

  @Column()
  title: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany(() => RolePermission, (role_permission) => role_permission.role)
  role_permissions: RolePermission[];
}
