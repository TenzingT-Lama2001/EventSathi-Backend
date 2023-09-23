import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from 'src/decorators/permission.decorator';
import { RoleService } from 'src/role/role.service';
import { IExtendedUser } from 'src/shared/extended-user.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest() as {
      user: IExtendedUser;
    };

    if (user.my_roles.length < 1) return false;
    const all_my_roles = user.my_roles.map(
      (role: { role_id: string }) => role.role_id,
    );
    const all_my_permissions =
      await this.roleService.getMyPermissions(all_my_roles);
    console.log(
      '🚀 ~ file: permission.guard.ts:30 ~ PermissionGuard ~ canActivate ~ all_my_permissions:',
      all_my_permissions,
    );

    context.switchToHttp().getRequest().user.my_permissions = [
      ...new Set(all_my_permissions),
    ];

    return [...new Set(requiredPermissions)].every((permission: string) => {
      return [...new Set(all_my_permissions)].includes(permission);
    });
  }
}
