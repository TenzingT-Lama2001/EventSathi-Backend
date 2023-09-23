import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleType } from './enum/roles.enum';

@Injectable()
export class RoleService {
  constructor(private dataSource: DataSource) {}

  async getMyPermissions(role_id: string[]) {
    const all_my_permissions = await this.dataSource
      .getRepository(RolePermission)
      .find({
        where: {
          role_id: In(role_id),
        },
        relations: { permission: true },
        select: { permission: { title: true } },
      });

    const permissions: string[] = [];
    for (const permission of all_my_permissions) {
      permissions.push(permission.permission.title);
    }
    return permissions;
  }

  async getRoleTitleFromId(role_id: string) {
    const role = await this.dataSource.getRepository(Role).findOne({
      where: { id: role_id },
    });
    return role.title;
  }
  async getRoleIdFromTitle(title: RoleType) {
    const role = await this.dataSource.getRepository(Role).findOne({
      where: { title },
    });
    return role.id;
  }
  async saveUserRole(user_id: string, role_id: string) {
    await this.dataSource.getRepository(UserRole).save({
      user_id,
      role_id,
    });
  }
}
