import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './orm-config';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { RoleModule } from './role/role.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // TypeOrm database integration
    TypeOrmModule.forRootAsync({
      useFactory: () => TypeOrmConfig,
    }),
    UsersModule,
    AuthModule,
    OtpModule,
    ActivityLogModule,
    RoleModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
