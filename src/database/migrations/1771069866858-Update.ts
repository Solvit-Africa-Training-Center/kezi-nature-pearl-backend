import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771069866858 implements MigrationInterface {
    name = 'Update1771069866858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "label"`);
        await queryRunner.query(`DROP TYPE "public"."addresses_label_enum"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "postal_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "postal_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "phone_number" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."addresses_label_enum" AS ENUM('home', 'work', 'other')`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "label" "public"."addresses_label_enum" NOT NULL DEFAULT 'home'`);
    }

}
