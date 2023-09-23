import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityLogDto {
  @ApiProperty({
    example: 'Ram logged in.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  // @ApiProperty({
  //   example: 'ram@gmail.com',
  // })
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;
}
