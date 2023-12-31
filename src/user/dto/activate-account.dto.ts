import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  code: string;
}
