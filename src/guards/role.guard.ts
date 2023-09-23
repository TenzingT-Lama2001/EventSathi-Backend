import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/role.decorator';
import { RoleService } from 'src/role/role.service';
import { IExtendedUser } from 'src/shared/extended-user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required_roles = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required_roles) return true;

    const { user } = context.switchToHttp().getRequest() as {
      user: IExtendedUser;
    };
    const my_role_titles: string[] = [];
    for (const user_role of user.my_roles) {
      const role_title = await this.roleService.getRoleTitleFromId(
        user_role.role_id,
      );
      my_role_titles.push(role_title);
    }

    return [...new Set(required_roles)].every((role: string) => {
      return [...new Set(my_role_titles)].includes(role);
    });
  }
}
