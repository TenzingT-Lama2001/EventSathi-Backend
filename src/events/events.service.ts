import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { CreateSpeakerDto } from '../speakers/dto/create-speaker.dto';
import { Speaker } from '../speakers/entities/speaker.entity';
import { SpeakerEvent } from '../speakers/entities/speaker-event.entity';

@Injectable()
export class EventsService {
  constructor(private readonly dataSource: DataSource) {}
  async createEvent(
    user_id: string,
    createEventDto: CreateEventDto,
    createSpeakerDto: CreateSpeakerDto[],
  ) {
    console.log(createSpeakerDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = await queryRunner.manager.getRepository(Event).save({
        ...createEventDto,
        organizer_id: user_id,
      });

      const speakers = await queryRunner.manager
        .getRepository(Speaker)
        .save(createSpeakerDto);

      const speakerEvents = speakers.map((speaker) => ({
        speaker_id: speaker.id,
        event_id: event.id,
      }));

      await queryRunner.manager.getRepository(SpeakerEvent).save(speakerEvents);
      await queryRunner.commitTransaction();
      return {
        message: 'Event created successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllEvents() {
    const events = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.speaker_events', 'speaker_event')
      .leftJoinAndSelect('speaker_event.speaker', 'speaker')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select()
      .getMany();

    return events;
    // const events = await this.dataSource.getRepository(Event).find({
    //   relations: {
    //     speaker_events: {
    //       speaker: true,
    //     },
    //     organizer: true,
    //   },
    //   select: {
    //     speaker_events: {
    //       id: true,
    //       speaker: {
    //         id: true,
    //       },
    //     },
    //   },
    // });
    // return events;
  }

  async getEvent(id: string) {
    const events = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .where('event.id = :id', { id })
      .leftJoinAndSelect('event.speaker_events', 'speaker_event')
      .leftJoinAndSelect('speaker_event.speaker', 'speaker')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select()
      .getMany();

    return events;
  }

  update(id: number) {
    return `This action updates a #${id} product`;
  }

  async removeEvent(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const isEvent = await queryRunner.manager
        .getRepository(Event)
        .findOne({ where: { id } });

      if (!isEvent) throw new BadRequestException('Event not found');

      // //delete event
      await queryRunner.manager.getRepository(Event).delete(id);

      //TODO:
      /**
       * Currently speaker_events gets deleted when event is deleted
       * But Speaker is not being deleted
       * As of now there is no use of speaker because speaker is not a role or does anything
       * its just a object
       * Or I could delete the speaker entity and just have speakers column in event entity
       */

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
