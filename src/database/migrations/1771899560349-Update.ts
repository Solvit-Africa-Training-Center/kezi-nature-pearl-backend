import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771899560349 implements MigrationInterface {
    name = 'Update1771899560349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "orderStatus" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_orderstatus_enum" RENAME TO "orders_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_orderstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "status" TO "orderStatus"`);
    }

}
