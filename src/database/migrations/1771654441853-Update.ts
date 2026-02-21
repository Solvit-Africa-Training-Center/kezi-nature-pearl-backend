import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771654441853 implements MigrationInterface {
    name = 'Update1771654441853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deletedAt"`);
    }

}
