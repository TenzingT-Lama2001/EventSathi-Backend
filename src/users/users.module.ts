import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUserController, UsersController } from './users.controller';
import { OtpModule } from 'src/otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OtpModule,
    JwtModule.register({}),
    RoleModule,
  ],
  controllers: [UsersController, AdminUserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
