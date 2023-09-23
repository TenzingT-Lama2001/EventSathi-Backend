import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendAccountActivationDto {
  @IsEmail()
  @ApiProperty({ example: 'ram@gmail.com' })
  email: string;
}
