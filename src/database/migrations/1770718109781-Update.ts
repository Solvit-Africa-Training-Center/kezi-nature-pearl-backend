import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1770718109781 implements MigrationInterface {
    name = 'Update1770718109781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "variant_name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "variant_name" character varying`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "session_id" character varying`);
    }

}
