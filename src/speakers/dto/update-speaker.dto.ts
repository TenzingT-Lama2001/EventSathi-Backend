import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSpeakerDto {
  @ApiProperty({ type: 'string', example: 'Speaker 1' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: 'text', example: 'Bio' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiProperty({ type: 'string', example: 'photo of speaker' })
  @IsOptional()
  @IsString()
  photo: string;
}
