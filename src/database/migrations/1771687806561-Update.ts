import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771687806561 implements MigrationInterface {
    name = 'Update1771687806561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping_address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping_address" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping_address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping_address" DROP NOT NULL`);
    }

}
