import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/decorators/match.decorator';

export class EditUserDto {
  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  first_name: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  middle_name: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  last_name: string;

  @ApiProperty({ type: 'string', example: 'Baneshwor' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({ type: 'string', example: '9824902116' })
  @IsOptional()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  avatar: string;

  @ApiProperty({ type: 'string', example: 'Bachelor in IT' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  education_qualification: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ minLength: 8, example: 'OldSecret@123' })
  old_password: string;

  @ApiProperty({ example: 'Password123!' })
  @ValidateIf((o) => !!o.old_password)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 'Password123!' })
  @ValidateIf((o) => !!o.old_password && !!o.password)
  @Match(EditUserDto, (s) => s.password)
  confirm_password: string;
}
