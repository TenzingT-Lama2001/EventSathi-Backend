import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  EventAgenda,
  EventLocationType,
  EventStatus,
} from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ type: 'string', example: 'Event 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ type: 'text', example: 'Description of event 1' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', example: 'Organization 1' })
  @IsString()
  @IsOptional()
  organization: string;

  @ApiProperty({ type: 'string', example: '2023-07-28' })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @ApiProperty({ type: 'string', example: '2023-07-28' })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @ApiProperty({ type: 'string', example: 'Organization 1' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  location: string;

  @ApiProperty({ type: 'string', example: 'Event image 1' })
  @IsString()
  event_image: string;

  @ApiProperty({ type: 'array', example: ['tag1', 'tag2'] })
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ApiProperty({ type: 'integer', example: 100 })
  @IsOptional()
  max_attendees: number;

  @ApiProperty({ type: 'string', example: '2023-07-28' })
  @IsDateString()
  @IsOptional()
  registration_deadline: Date;

  @ApiProperty({ type: 'string', example: EventStatus.UPCOMING })
  @IsEnum(EventStatus)
  @IsIn([EventStatus.UPCOMING, EventStatus.STARTED, EventStatus.ENDED])
  status: EventStatus;

  @ApiProperty({ type: 'string', example: EventLocationType.ONLINE })
  @IsEnum(EventLocationType)
  @IsIn([EventLocationType.IN_PERSON, EventLocationType.ONLINE])
  event_location_type: EventLocationType;

  @ApiProperty({ type: 'string', example: 'meet.google.com/gxy-xcv-ere' })
  @IsString()
  @IsOptional()
  event_link: string;

  @ApiProperty({
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  organizer_id: string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        title: 'Session 1',
        time: '2023-10-20T09:00:00Z',
        speaker: 'John Smith',
      },
      {
        title: 'Session 2',
        time: '2023-10-20T11:00:00Z',
        speaker: 'Jane Doe',
      },
    ],
  })
  @IsOptional()
  agenda: EventAgenda[];
}
