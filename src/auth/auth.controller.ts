import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ResendEmailVerificationDto } from './dto/resend-verification.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { Request } from 'express';
import { SendAccountActivationDto } from './dto/send-account-activation.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Get access_token' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDto, @Req() req: Request) {
    return await this.authService.login(input, req.ip);
  }

  @ApiOperation({ summary: 'Resend email verification code' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  async resendEmailVerificationCode(@Body() input: ResendEmailVerificationDto) {
    return await this.authService.resendEmailVerification(input);
  }
  @ApiOperation({ summary: 'Send account activation  code' })
  @HttpCode(HttpStatus.OK)
  @Post('send-account-activation-code')
  async sendAccountActivationCode(@Body() input: SendAccountActivationDto) {
    return await this.authService.sendAccountActivation(input);
  }

  @ApiOperation({ summary: 'Verify email with code' })
  @HttpCode(HttpStatus.OK)
  @Post('verification')
  async emailVerification(@Body() input: EmailVerificationDto) {
    return await this.authService.verifyEmail(input.email, input.code);
  }
}
