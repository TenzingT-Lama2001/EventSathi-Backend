import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { GITHUB_STRATEGY } from 'src/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: GITHUB_STRATEGY.client_id,
      clientSecret: GITHUB_STRATEGY.client_secret,
      callbackURL: GITHUB_STRATEGY.callbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done,
  ) {
    console.log(
      '🚀 ~ file: github.strategy.ts:32 ~ GithubStrategy ~ classGithubStrategyextendsPassportStrategy ~ profile:',
      profile,
    );
    try {
      // Check if the user with this email already exists in your database
      const user = await this.dataSource.getRepository(User).findOne({
        where: {
          email: profile.emails[0].value,
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
        const user = await this.authService.registerUserGithubCallback(profile);
        const access_token = await this.authService.generateAccessToken(user);
        return done(null, access_token);
      }
    } catch (error) {
      return done(error, false);
    }
  }
}
