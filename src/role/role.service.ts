import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleType } from './enum/roles.enum';
import { AssignRoleDto, CreateRoleDto } from './dto/role.dto';

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
  async saveUserRole(user_ids: string | string[], role_ids: string | string[]) {
    // Ensure that user_ids and role_ids are always arrays
    const user_idArray = Array.isArray(user_ids) ? user_ids : [user_ids];
    const role_idArray = Array.isArray(role_ids) ? role_ids : [role_ids];

    // Loop through the arrays and save each combination of user_id and role_id
    const user_roles: { user_id: string; role_id: string }[] = [];
    for (const user_id of user_idArray) {
      for (const role_id of role_idArray) {
        user_roles.push({
          user_id,
          role_id,
        });
      }
    }
    if (user_roles.length > 0) {
      await this.dataSource.getRepository(UserRole).save(user_roles);
    }
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { user_id, role_id } = assignRoleDto;

    const user_role = await this.dataSource
      .getRepository(UserRole)
      .find({ where: { user_id: In(user_id), role_id: In(role_id) } });

    if (user_role.length > 0) {
      return {
        message: 'User already has this role',
      };
    }
    await this.saveUserRole(user_id, role_id);
    return {
      message: 'Role assigned successfully',
    };
  }

  async createRole(user_id: string, createRoleDto: CreateRoleDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { title, permissions } = createRoleDto;

      const role = await queryRunner.manager.getRepository(Role).save({
        title,
        creator_id: user_id,
      });

      const role_permissions: { role_id: string; permission_id: string }[] = [];
      for (const permission_id of permissions) {
        role_permissions.push({
          role_id: role.id,
          permission_id,
        });
      }
      await queryRunner.manager
        .getRepository(RolePermission)
        .save(role_permissions);

      await queryRunner.commitTransaction();
      return {
        message: 'Role created successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
