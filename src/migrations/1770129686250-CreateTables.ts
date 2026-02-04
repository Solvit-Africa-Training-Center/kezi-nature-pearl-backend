import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1770129686250 implements MigrationInterface {
    name = 'CreateTables1770129686250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."categories_name_enum"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."categories_name_enum" AS ENUM('kids', 'adults', 'elders')`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" "public"."categories_name_enum" NOT NULL DEFAULT 'adults'`);
    }

}
