import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    example: [
      'e9e9c9f8-3d1b-4e2a-9c5e-8f7f9b1c0d7a',
      '0c608e4a-7211-4ab5-995f-8b6364a7d013',
    ],
  })
  @IsUUID(4, { each: true })
  user_id: string[];

  @ApiProperty({
    example: [
      '5cdd2f01-ea86-46ad-8fa1-01d070c78aea',
      'abbfbc07-53bb-4b6a-97c3-61e06c584f6d',
    ],
  })
  @IsUUID('4', { each: true })
  role_id: string[];
}
export class UnassignRoleDto {
  @ApiProperty({
    example: [
      'e9e9c9f8-3d1b-4e2a-9c5e-8f7f9b1c0d7a',
      '0c608e4a-7211-4ab5-995f-8b6364a7d013',
    ],
  })
  @IsUUID(4, { each: true })
  user_id: string[];

  @ApiProperty({
    example: [
      '5cdd2f01-ea86-46ad-8fa1-01d070c78aea',
      'abbfbc07-53bb-4b6a-97c3-61e06c584f6d',
    ],
  })
  @IsUUID('4', { each: true })
  role_id: string[];
}

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  title: string;

  @ApiProperty({
    example: [
      '5cdd2f01-ea86-46ad-8fa1-01d070c78aea',
      'abbfbc07-53bb-4b6a-97c3-61e06c584f6d',
    ],
  })
  @IsUUID('4', { each: true })
  permissions: string[];
}
