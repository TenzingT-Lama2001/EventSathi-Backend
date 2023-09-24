import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';
import { User } from './entities/user.entity';
import { OtpService } from 'src/otp/otp.service';
import { OTP, OTPType } from 'src/otp/entities/otp.entity';
import { MailType, getMailTemplates } from 'src/helpers/templates';
import { sendMail } from 'src/helpers/mail';
import { UserPasswordHistory } from './entities/user-password-history.entity';
import { IExtendedUser } from 'src/shared/extended-user.interface';
import { EditUserDto } from './dto/edit-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/config';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/enum/roles.enum';
import { StrategyConfiguration } from 'src/auth/strategies/strategy.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly otpService: OtpService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async createUser(user: CreateUserDto) {
    const { confirm_password: _unused_confirm_password, ...user_info } = user;
    user_info.password = await argon.hash(user.password);
    const { password: _unused_password, ...savedUser } = await this.dataSource
      .getRepository(User)
      .save(user_info);
    const user_role_id = await this.roleService.getRoleIdFromTitle(
      RoleType.USER,
    );
    await this.roleService.saveUserRole(savedUser.id, user_role_id);

    return savedUser;
  }

  async createUserFromProfile(data, strategy: StrategyConfiguration) {
    const user = data._json;
    const new_user: Partial<User> = {
      email: user.email,
      password: await argon.hash(strategy.password),
      first_name: user.given_name,
      last_name: user.family_name,
      is_active: true,
      is_verified: true,
      avatar: user.picture,
    };
    const savedUser = await this.dataSource.getRepository(User).save(new_user);
    const user_role_id = await this.roleService.getRoleIdFromTitle(
      RoleType.USER,
    );
    await this.roleService.saveUserRole(savedUser.id, user_role_id);

    return savedUser;
  }
  async getUser(id: string) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        middle_name: true,
        avatar: true,
        last_name: true,
        is_verified: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
  async getUserByEmail(email: string) {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: email.toLowerCase() } });
  }

  async getUserByEmailWithPassword(email: string) {
    return await this.dataSource.getRepository(User).findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'password', 'is_verified'],
    });
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    if (user.is_verified)
      throw new BadRequestException('User already verified.');

    const isValid = await this.otpService.validateOtp(
      user.id,
      code,
      OTPType.emailVerification,
    );

    if (!isValid) throw new NotFoundException('Invalid OTP');

    user.is_verified = true;
    await this.dataSource.getRepository(User).save(user);
    await this.otpService.deleteOtp(user.id, code, OTPType.emailVerification);
  }
  async initiateResetPassword(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const otp = await this.otpService.createOtp(user.id, OTPType.passwordReset);

    const html = await getMailTemplates(MailType.reset_password_otp, {
      otp: otp.code,
    });

    sendMail({
      to: email,
      subject: 'Password Reset',
      html,
    });
  }
  async initiateResendOtp(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const previousOtp = await this.otpService.findLastOtp(
      user.id,
      OTPType.passwordReset,
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
    const otp = await this.otpService.createOtp(user.id, OTPType.passwordReset);

    sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Your Password Reset code is: ${otp.code}`,
    });
  }
  async validateOtp(email: string, code: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const isValid = await this.otpService.validateOtp(
      user.id,
      code,
      OTPType.passwordReset,
    );
    if (!isValid) throw new NotFoundException('Invalid OTP.');

    return { message: 'OTP Validated successfully.', code };
  }
  async hasPreviouslyUsedThisPassword(
    user_id: string,
    password: string,
  ): Promise<boolean> {
    const user_password_history_rows = await this.dataSource
      .getRepository(UserPasswordHistory)
      .find({ where: { user_id } });

    if (user_password_history_rows.length === 0) return false;

    for (const row of user_password_history_rows) {
      if (await argon.verify(row.password, password)) return true;
    }

    return false;
  }
  async finalizeResetPassword(email: string, code: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const isValid = await this.otpService.validateOtp(
      user.id,
      code,
      OTPType.passwordReset,
    );
    if (!isValid) throw new NotFoundException('Invalid OTP.');

    const has_previously_used_this_password =
      await this.hasPreviouslyUsedThisPassword(user.id, password);

    if (has_previously_used_this_password)
      throw new BadRequestException('You cannot reuse previous passwords.');

    const hashed_password = await argon.hash(password);
    await this.dataSource
      .getRepository(User)
      .update({ id: user.id }, { password: hashed_password });

    await this.dataSource
      .getRepository(UserPasswordHistory)
      .save({ user_id: user.id, password: hashed_password });

    await this.dataSource
      .getRepository(OTP)
      .delete({ userId: user.id, type: OTPType.passwordReset });

    const text = `
    Dear ${user.email},

    This email is to confirm that your password has been successfully reset.
    If you have any further questions or concerns, please don't hesitate to reach out to us.

    Best Regards,
    Event Sathi
    `;
    sendMail({
      to: email,
      replyTo: 'contact@event-sathi.com',
      subject: 'Attention: Password Reset Confirmation',
      text,
    });

    return { message: 'Password reset successfully.' };
  }
  async editUserProfile(
    user: IExtendedUser,
    input: EditUserDto,
    file?: Express.Multer.File,
  ) {
    let jwt: string | null = null;

    if (file?.path) {
      input.avatar = file?.path || user.avatar;
    }

    if (input.old_password && input.password) {
      const user_row = await this.dataSource.getRepository(User).findOne({
        where: { id: user.id },
        select: ['id', 'password'],
      });

      const valid = await argon.verify(user_row.password, input.old_password);
      if (!valid) throw new BadRequestException('Invalid old password');

      const has_previously_used_this_password =
        await this.hasPreviouslyUsedThisPassword(user.id, input.password);
      if (has_previously_used_this_password)
        throw new BadRequestException('You cannot reuse previous passwords.');

      input.password = await argon.hash(input.password);
    }

    const {
      old_password: _unused_old_password,
      confirm_password: _unused_confirm_password,
      ...rest
    } = input;

    await this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .update(rest)
      .where('id = :id', { id: user.id })
      .updateEntity(true)
      .execute();

    if (input.password && input.old_password) {
      const user_password_history_row = await this.dataSource
        .getRepository(UserPasswordHistory)
        .save({ user_id: user.id, password: input.password });

      await this.dataSource
        .getRepository(OTP)
        .delete({ userId: user.id, type: OTPType.passwordReset });

      jwt = await this.jwtService.signAsync(
        { sub: user.id, pawan: user_password_history_row.id },
        {
          expiresIn: '7d',
          secret: JWT.secret,
        },
      );

      const text = `
    Dear ${user.email},

    This email is to confirm that your password has been successfully reset.
    If you have any further questions or concerns, please don't hesitate to reach out to us.

    Best Regards,
    Event Sathi
    `;

      sendMail({
        to: user.email,
        replyTo: 'contact@event-sathi.com',
        subject: 'Attention: Password Change Confirmation',
        text,
      });
    }

    return { message: 'User updated successfully.', jwt };
  }

  async getIsUserActive(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    return user.is_active;
  }

  async deactivateUser(id: string) {
    await this.dataSource
      .getRepository(User)
      .update({ id }, { is_active: false });
  }

  async activateUser(email: string, code: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const isValid = await this.otpService.validateOtp(
      user.id,
      code,
      OTPType.accountActivation,
    );

    if (!isValid) throw new BadRequestException('Invalid OTP');
    await this.dataSource
      .getRepository(User)
      .update({ id: user.id }, { is_active: true });

    await this.otpService.deleteOtp(user.id, code, OTPType.accountActivation);
  }

  async getAllUsers() {
    const users = await this.dataSource.getRepository(User).find();
    return users;
  }
}
