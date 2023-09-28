import { MigrationInterface, QueryRunner } from "typeorm";

export class EventSathi1695909955991 implements MigrationInterface {
    name = 'EventSathi1695909955991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "speakers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "bio" text, "photo" character varying(255), CONSTRAINT "PK_b3818c94af77a0cf73403ecef14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "speaker_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "speaker_id" uuid NOT NULL, "event_id" uuid NOT NULL, CONSTRAINT "PK_5bd5978e1d35747b54151884e92" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_type_enum" AS ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'OTHER', 'ACCOUNT_ACTIVATION')`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(6) NOT NULL, "type" "public"."otp_type_enum" NOT NULL DEFAULT 'OTHER', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_password_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_16a5ce4ff864deb1bf26a5752e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "ip_address" text NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parent_id" uuid, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc1eb9ddcf492149808ee04f3b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission_category_id" uuid NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE TABLE "user_role" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_f634684acb47c1a158b83af5150" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "creator_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_attendees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "attendee_id" uuid NOT NULL, CONSTRAINT "PK_27510e317f002b361d2904d7f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "middle_name" character varying(255), "last_name" character varying(255), "address" character varying(255), "phone_number" character varying(20), "education_qualification" character varying(255), "avatar" text, "is_verified" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "password" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('LONG_ANSWER', 'SHORT_ANSWER', 'MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "type" "public"."question_type_enum" NOT NULL, "options" json, "questionnaireId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questionnaire" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "event_id" uuid NOT NULL, CONSTRAINT "REL_aa3d60519fec09822ea2a01562" UNIQUE ("event_id"), CONSTRAINT "PK_e8232a11eaabac903636eb7e71e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('UPCOMING', 'STARTED', 'ENDED')`);
        await queryRunner.query(`CREATE TYPE "public"."events_event_location_type_enum" AS ENUM('ONLINE', 'IN_PERSON')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "organization" character varying(255), "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "location" character varying(255), "event_image" character varying(255) NOT NULL, "tags" text array, "max_attendees" integer, "registration_deadline" TIMESTAMP, "status" "public"."events_status_enum" NOT NULL DEFAULT 'UPCOMING', "event_location_type" "public"."events_event_location_type_enum" NOT NULL DEFAULT 'ONLINE', "event_link" character varying(255), "organizer_id" uuid NOT NULL, "agenda" json DEFAULT '[]', CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "speaker_events" ADD CONSTRAINT "FK_c3ca2a8b7d025767cc9ae9e071b" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "speaker_events" ADD CONSTRAINT "FK_1b7656762bb26c5d55e4c982a93" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_password_history" ADD CONSTRAINT "FK_c273c40bfa9653d6c64f96667c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_log" ADD CONSTRAINT "FK_d19abacc8a508c0429478ad166b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_category" ADD CONSTRAINT "FK_96738987eb776387947f9c44716" FOREIGN KEY ("parent_id") REFERENCES "permission_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_8ecc048af4a369260514cc044b7" FOREIGN KEY ("permission_category_id") REFERENCES "permission_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_b5ab0348f4e1f79ee80f52c9690" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_attendees" ADD CONSTRAINT "FK_c296e70709cd6f4cb6b4e3e7e2a" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_attendees" ADD CONSTRAINT "FK_2a9473efc5f46420ae725e379ca" FOREIGN KEY ("attendee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_3f7828c3b2c8db7b5e41cade66a" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaire"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questionnaire" ADD CONSTRAINT "FK_aa3d60519fec09822ea2a015624" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e"`);
        await queryRunner.query(`ALTER TABLE "questionnaire" DROP CONSTRAINT "FK_aa3d60519fec09822ea2a015624"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_3f7828c3b2c8db7b5e41cade66a"`);
        await queryRunner.query(`ALTER TABLE "event_attendees" DROP CONSTRAINT "FK_2a9473efc5f46420ae725e379ca"`);
        await queryRunner.query(`ALTER TABLE "event_attendees" DROP CONSTRAINT "FK_c296e70709cd6f4cb6b4e3e7e2a"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_b5ab0348f4e1f79ee80f52c9690"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_8ecc048af4a369260514cc044b7"`);
        await queryRunner.query(`ALTER TABLE "permission_category" DROP CONSTRAINT "FK_96738987eb776387947f9c44716"`);
        await queryRunner.query(`ALTER TABLE "activity_log" DROP CONSTRAINT "FK_d19abacc8a508c0429478ad166b"`);
        await queryRunner.query(`ALTER TABLE "user_password_history" DROP CONSTRAINT "FK_c273c40bfa9653d6c64f96667c4"`);
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`ALTER TABLE "speaker_events" DROP CONSTRAINT "FK_1b7656762bb26c5d55e4c982a93"`);
        await queryRunner.query(`ALTER TABLE "speaker_events" DROP CONSTRAINT "FK_c3ca2a8b7d025767cc9ae9e071b"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_event_location_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`DROP TABLE "questionnaire"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "event_attendees"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "permission_category"`);
        await queryRunner.query(`DROP TABLE "activity_log"`);
        await queryRunner.query(`DROP TABLE "user_password_history"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
        await queryRunner.query(`DROP TABLE "speaker_events"`);
        await queryRunner.query(`DROP TABLE "speakers"`);
    }

}
