import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;
}

export class FinalizeResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'Secret@520' })
  password: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  code: string;
}

export class ValidateResetPasswordOtpDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  code: string;
}
