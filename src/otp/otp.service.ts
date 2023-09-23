import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateOTP } from 'src/helpers/utils';
import { DataSource } from 'typeorm';
import { OTP, OTPType } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(private readonly dataSource: DataSource) {}

  async createOtp(userId: string, type: OTPType) {
    const otp = new OTP();

    otp.code = await generateOTP(6); // generate random 6 digit code
    otp.type = type;
    otp.userId = userId;

    console.log(
      '🚀 ~ file: otp.service.ts:16 ~ OtpService ~ createOtp ~ otp:',
      otp,
    );
    return this.dataSource.getRepository(OTP).save(otp);
  }

  deleteOtp(userId: string, code: string, type: OTPType) {
    return this.dataSource.getRepository(OTP).delete({ userId, code, type });
  }

  async validateOtp(userId: string, code: string, type: OTPType) {
    // OTP is valid for 15 minutes only
    const expiryTime = 1000 * 60 * 15;

    const otp = await this.dataSource.getRepository(OTP).findOne({
      where: { userId, code, type },
    });
    if (!otp) throw new NotFoundException('Invalid OTP');

    if (otp.createdAt.getTime() + expiryTime < Date.now()) {
      throw new BadRequestException('OTP has expired!');
    }
    return true;
  }

  async findLastOtp(userId: string, type: OTPType) {
    return await this.dataSource.getRepository(OTP).findOne({
      where: {
        userId,
        type,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
