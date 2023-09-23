import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GOOGLE_STRATEGY, JWT } from 'src/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { UserPasswordHistory } from 'src/users/entities/user-password-history.entity';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: GOOGLE_STRATEGY.client_id,
      clientSecret: GOOGLE_STRATEGY.client_secret,
      callbackURL: GOOGLE_STRATEGY.callbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      // Check if the user with this email already exists in your database
      const user = await this.dataSource.getRepository(User).findOne({
        where: {
          email: profile._json.email,
        },
        select: {
          id: true,
          password: true,
        },
      });
      console.log(
        '🚀 ~ file: google.strategy.ts:30 ~ GoogleStrategy ~ classGoogleStrategyextendsPassportStrategy ~ user:',
        user,
      );

      if (user) {
        // Update the user's profile data if needed
        // Then, return the user for the current session
        const user_password_history_row = await this.dataSource
          .getRepository(UserPasswordHistory)
          .findOne({
            where: { user_id: user.id },
            order: { created_at: 'DESC' },
          });

        let payload: {
          sub: string;
          user_password_history_id: string;
        };

        if (user_password_history_row) {
          payload = {
            sub: user.id,
            user_password_history_id: user_password_history_row.id,
          };
        } else {
          const new_user_password_history_row = await this.dataSource
            .getRepository(UserPasswordHistory)
            .save({ user_id: user.id, password: user.password });
          payload = {
            sub: user.id,
            user_password_history_id: new_user_password_history_row.id,
          };
        }
        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: JWT.secret,
        });
        return done(null, access_token);
      } else {
        // If the user doesn't exist, create a new user in your database
        const user = await this.authService.registerUserGoogleCallback(profile);
        const user_password_history_row = await this.dataSource
          .getRepository(UserPasswordHistory)
          .findOne({
            where: { user_id: user.id },
            order: { created_at: 'DESC' },
          });

        let payload: {
          sub: string;
          user_password_history_id: string;
        };

        if (user_password_history_row) {
          payload = {
            sub: user.id,
            user_password_history_id: user_password_history_row.id,
          };
        } else {
          const new_user_password_history_row = await this.dataSource
            .getRepository(UserPasswordHistory)
            .save({ user_id: user.id, password: user.password });
          payload = {
            sub: user.id,
            user_password_history_id: new_user_password_history_row.id,
          };
        }
        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: JWT.secret,
        });
        // Return the newly created user
        return done(null, access_token);
      }
    } catch (error) {
      // Handle any errors that occur during the process
      return done(error, false);
    }
  }
}
