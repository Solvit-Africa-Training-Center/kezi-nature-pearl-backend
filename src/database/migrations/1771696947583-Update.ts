import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771696947583 implements MigrationInterface {
    name = 'Update1771696947583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "guestId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "subject"`);
        await queryRunner.query(`CREATE TYPE "public"."contact_us_subject_enum" AS ENUM('General Inquiry', 'Support', 'Feedback', 'Testimony')`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "subject" "public"."contact_us_subject_enum" NOT NULL DEFAULT 'Support'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "subject"`);
        await queryRunner.query(`DROP TYPE "public"."contact_us_subject_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "subject" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP COLUMN "guestId"`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD "phone" character varying`);
    }

}
