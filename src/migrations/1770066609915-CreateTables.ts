import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1770066609915 implements MigrationInterface {
    name = 'CreateTables1770066609915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "images" text array`);
        await queryRunner.query(`ALTER TABLE "products" ADD "oldPrice" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "newPrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "newPrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "oldPrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
    }

}
