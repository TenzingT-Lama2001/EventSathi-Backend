import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JWT } from 'src/config';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/entities/otp.entity';
import { MailType, getMailTemplates } from 'src/helpers/templates';
import { sendMail } from 'src/helpers/mail';
import { ResendEmailVerificationDto } from './dto/resend-verification.dto';
import { UserPasswordHistory } from '../users/entities/user-password-history.entity';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { SendAccountActivationDto } from './dto/send-account-activation.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
  ) {}

  async register(input: CreateUserDto) {
    const user_row = await this.userService.getUserByEmail(input.email);

    if (user_row)
      throw new BadRequestException({ message: 'Email already exists.' });

    const { ...savedUser } = await this.userService.createUser(input);

    // send email with OTP
    const otp = await this.otpService.createOtp(
      savedUser.id,
      OTPType.emailVerification,
    );

    const html = await getMailTemplates(MailType.new_registration_otp, {
      otp: otp.code,
    });

    sendMail({
      to: savedUser.email,
      subject: 'Email Verification',
      html,
    });

    return savedUser;
  }

  async registerUserGoogleCallback(data) {
    return this.userService.createUserFromGoogleProfile(data);
  }

  async login(input: LoginDto, ip_address: string) {
    const user = await this.validateUser(input.email, input.password);
    const user_password_history_row = await this.dataSource
      .getRepository(UserPasswordHistory)
      .findOne({ where: { user_id: user.id }, order: { created_at: 'DESC' } });

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

    const create_activity_log_payload = {
      title: ` ${input.email} logged in`,
    };
    await this.activityLogService.create(
      create_activity_log_payload,
      user.id,
      ip_address,
    );
    return { verified: true, jwt: access_token };
  }

  async validateUser(email: string, password: string) {
    const is_active = await this.userService.getIsUserActive(email);

    if (!is_active)
      throw new BadRequestException({
        message: 'User is not active. Please activate your account',
      });

    const user = await this.userService.getUserByEmailWithPassword(email);
    if (!user)
      throw new UnauthorizedException({
        verified: null,
        message: 'Invalid email or password.',
      });
    if (!user.password)
      throw new UnauthorizedException({
        verified: null,
        message: 'Please register your account.',
      });

    const valid = await argon.verify(user.password, password);
    if (!valid)
      throw new UnauthorizedException({
        verified: null,
        message: 'Invalid email or password.',
      });

    if (!user.is_verified) {
      // send email with OTP
      const otp = await this.otpService.createOtp(
        user.id,
        OTPType.emailVerification,
      );

      const html = await getMailTemplates(MailType.new_registration_otp, {
        otp: otp.code,
      });

      sendMail({ to: email, subject: 'Email Verification', html });

      throw new UnauthorizedException({
        verified: false,
        email,
        message:
          'User is not yet verified. Please check your inbox to verify your email.',
      });
    }

    return user;
  }

  async resendEmailVerification(input: ResendEmailVerificationDto) {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.is_verified)
      throw new BadRequestException('User already verified.');

    const previousOtp = await this.otpService.findLastOtp(
      user.id,
      OTPType.emailVerification,
    );

    if (previousOtp) {
      const waitTime = 1000 * 60 * 1; // resend only after one minute
      const completedWaitTime =
        previousOtp.createdAt.getTime() + waitTime < Date.now();
      if (!completedWaitTime) {
        throw new BadRequestException('Please request OTP after one minute.');
      }
    }

    // send email with OTP
    const otp = await this.otpService.createOtp(
      user.id,
      OTPType.emailVerification,
    );

    const html = await getMailTemplates(MailType.new_registration_otp, {
      otp: otp.code,
    });

    sendMail({
      to: user.email,
      subject: 'Email Verification',
      html,
    });

    return { message: 'Email verification OTP has been resent.' };
  }
  async sendAccountActivation(input: SendAccountActivationDto) {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) throw new NotFoundException('User not found');
    if (user.is_active)
      throw new BadRequestException('User is already active.');

    const previousOtp = await this.otpService.findLastOtp(
      user.id,
      OTPType.accountActivation,
    );

    if (previousOtp) {
      const waitTime = 1000 * 60 * 1; // resend only after one minute
      const completedWaitTime =
        previousOtp.createdAt.getTime() + waitTime < Date.now();
      if (!completedWaitTime) {
        throw new BadRequestException('Please request OTP after one minute.');
      }
    }

    // send email with OTP
    const otp = await this.otpService.createOtp(
      user.id,
      OTPType.accountActivation,
    );

    const html = await getMailTemplates(MailType.account_activation_otp, {
      otp: otp.code,
    });

    sendMail({
      to: user.email,
      subject: 'Account Activation',
      html,
    });

    return { message: 'Account Activation OTP has been resent.' };
  }
  async verifyEmail(email: string, code: string) {
    await this.userService.verifyEmail(email, code);

    return { message: 'Email has been successfully verified.' };
  }
}
