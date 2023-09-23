import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT } from 'src/config';
import { UserPasswordHistory } from '../../users/entities/user-password-history.entity';
import { User } from '../..//users/entities/user.entity';
import { DataSource } from 'typeorm';
import { UserRole } from 'src/role/entities/user-role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Check if the user account is deactivated
    const user_status = await this.dataSource.getRepository(User).findOne({
      where: { id: payload.sub, is_active: true }, // Add the is_active condition
    });

    if (!user_status) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const user_password_history_row = await this.dataSource
      .getRepository(UserPasswordHistory)
      .findOne({
        where: { user_id: payload.sub },
        order: { created_at: 'DESC' },
        relations: {
          user: true,
        },
      });

    if (!user_password_history_row) throw new UnauthorizedException();

    if (user_password_history_row.id !== payload.user_password_history_id)
      throw new UnauthorizedException();

    const user = user_password_history_row.user;

    const user_roles = await this.dataSource.getRepository(UserRole).find({
      where: {
        user_id: user.id,
      },
    });

    const my_roles: {
      role_id: string;
    }[] = [];

    for (const user_role of user_roles) {
      my_roles.push({ role_id: user_role.role_id });
    }
    console.log(
      '🚀 ~ file: jwt.strategy.ts:56 ~ JwtStrategy ~ validate ~ my_roles:',
      my_roles,
    );
    return {
      ...user,
      my_roles,
    };
  }
}
