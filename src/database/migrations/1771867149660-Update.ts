import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771867149660 implements MigrationInterface {
    name = 'Update1771867149660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "deletedAt"`);
    }

}
