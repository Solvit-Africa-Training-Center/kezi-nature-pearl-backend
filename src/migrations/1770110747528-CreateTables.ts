import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1770110747528 implements MigrationInterface {
    name = 'CreateTables1770110747528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contactus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "subject" character varying NOT NULL, "message" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2fdc48543a5c78775ea48889cec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" uuid array`);
        await queryRunner.query(`ALTER TABLE "products" ADD "oldPrice" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "newPrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "newPrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "oldPrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imageId" character varying`);
        await queryRunner.query(`DROP TABLE "contactus"`);
    }

}
