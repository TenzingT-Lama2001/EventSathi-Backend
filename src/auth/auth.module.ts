import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from 'src/otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    OtpModule,
    PassportModule,
    ActivityLogModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
