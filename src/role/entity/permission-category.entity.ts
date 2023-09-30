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
import { Permission } from './permission.entity';

@Entity({ name: 'permission_category' })
export class PermissionCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  parent_id: string;
  @JoinColumn({ name: 'parent_id' })
  @ManyToOne(() => PermissionCategory, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: PermissionCategory;

  @Column()
  title: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany(() => Permission, (permission) => permission.permission_category)
  permissions: Permission[];
}
