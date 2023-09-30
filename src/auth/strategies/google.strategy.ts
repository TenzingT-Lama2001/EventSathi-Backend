import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GOOGLE_STRATEGY } from 'src/config';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
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
    _accessToken: string,
    _refreshToken: string,
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

      if (user) {
        const access_token = await this.authService.generateAccessToken(user);
        return done(null, access_token);
      } else {
        const user = await this.authService.registerUserGoogleCallback(profile);
        const access_token = await this.authService.generateAccessToken(user);
        return done(null, access_token);
      }
    } catch (error) {
      return done(error, false);
    }
  }
}
