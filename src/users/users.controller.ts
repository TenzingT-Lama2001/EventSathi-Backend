import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FinalizeResetPasswordDto,
  InitiateResetPasswordDto,
} from './dto/reset-password.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { IExtendedUser } from 'src/shared/extended-user.interface';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditUserDto } from './dto/edit-user.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import * as multer from 'multer';
import { RoleType } from 'src/role/enum/roles.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'fetch current user' })
  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getCurrentUser(@GetUser() user: IExtendedUser) {
    return await this.usersService.getUser(user.id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.diskStorage({
        destination: './uploads', // Specify your upload folder
        filename: (req, file, callback) => {
          // Customize the filename as needed
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + file.originalname,
          );
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Patch('current-user')
  async editUser(
    @GetUser() user: IExtendedUser,
    @Body() input: EditUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.editUserProfile(user, input, file);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async initiateResetPassword(@Body() input: InitiateResetPasswordDto) {
    await this.usersService.initiateResetPassword(input.email);
    return { message: 'Password reset OTP sent.' };
  }

  // @ApiOperation({ summary: 'Validate OTP' })
  // @Patch('validate-otp')
  // async validateOtp(@Body() input: ValidateResetPasswordOtpDto) {
  //   return this.usersService.validateOtp(input.email, input.code);
  // }

  @ApiOperation({ summary: 'Reset Password' })
  @Patch('reset-password')
  async finalizeResetPassword(@Body() input: FinalizeResetPasswordDto) {
    return this.usersService.finalizeResetPassword(
      input.email,
      input.code,
      input.password,
    );
  }

  @ApiOperation({ summary: 'Resend OTP' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(@Body() input: InitiateResetPasswordDto) {
    await this.usersService.initiateResendOtp(input.email);
    return { message: 'Password reset OTP sent.' };
  }

  @ApiOperation({ summary: 'Deactivate account' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('deactivate-account')
  async deactivateAccount(@GetUser() user: IExtendedUser) {
    await this.usersService.deactivateUser(user.id);
    return { message: 'Account deactivated successfully' };
  }
  @ApiOperation({ summary: 'Activate account' })
  @HttpCode(HttpStatus.OK)
  @Patch('activate-account')
  async activateAccount(@Body() input: ActivateAccountDto) {
    await this.usersService.activateUser(input.email, input.code);
    return { message: 'Account activated successfully' };
  }
}
@ApiTags('admin/user')
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get all user' })
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
