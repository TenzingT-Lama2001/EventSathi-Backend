import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ minLength: 8, example: 'Secret@123' })
  password: string;
}
