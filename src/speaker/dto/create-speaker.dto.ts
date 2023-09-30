import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpeakerDto {
  @ApiProperty({ type: 'string', example: 'Speaker 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: 'text', example: 'Bio' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty({ type: 'string', example: 'photo of speaker' })
  @IsString()
  @IsOptional()
  photo: string;
}
