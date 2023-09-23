import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ram@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ram' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  first_name: string;

  @ApiProperty({ example: 'Bahadur' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  middle_name: string;

  @ApiProperty({ example: 'Singh' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  last_name: string;

  @ApiProperty({ example: 'Password123!' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 'Password123!' })
  @Match(CreateUserDto, (s) => s.password)
  confirm_password: string;
}
