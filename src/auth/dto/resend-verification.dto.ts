import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendEmailVerificationDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;
}
