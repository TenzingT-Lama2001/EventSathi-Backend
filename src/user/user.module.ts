import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminUserController, UserController } from './user.controller';
import { OtpModule } from 'src/otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OtpModule,
    JwtModule.register({}),
    RoleModule,
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
