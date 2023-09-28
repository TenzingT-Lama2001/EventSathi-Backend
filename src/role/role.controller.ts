import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { PermissionType } from 'src/role/enum/permissions.enum';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RoleService } from './role.service';
import { AssignRoleDto, CreateRoleDto } from './dto/role.dto';
import { DataSource, In } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { IExtendedUser } from 'src/shared/extended-user.interface';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('create-role')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.CREATE_ROLE)
  async createRole(
    @GetUser() user: IExtendedUser,
    @Body() payload: CreateRoleDto,
  ) {
    const { permissions } = payload;

    const permission_count = await this.dataSource
      .getRepository(Permission)
      .count({
        where: {
          id: In(permissions),
        },
      });
    if (permission_count !== permissions.length)
      throw new BadRequestException({
        message: 'Some permissions seems invalid',
      });

    return await this.roleService.createRole(user.id, payload);
  }
  @Post('assign-roles')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.ASSIGN_ROLE)
  async assignRole(@Body() payload: AssignRoleDto) {
    const { user_id, role_id } = payload;
    const user_count = await this.dataSource.getRepository(User).count({
      where: {
        id: In(user_id),
      },
    });

    if (user_count !== user_id.length)
      throw new BadRequestException('Some user id seems invalid');

    const role_count = await this.dataSource.getRepository(Role).count({
      where: {
        id: In(role_id),
      },
    });

    if (role_count !== role_id.length)
      throw new BadRequestException('Some user id seems invalid');
    return await this.roleService.assignRole(payload);
  }
}
