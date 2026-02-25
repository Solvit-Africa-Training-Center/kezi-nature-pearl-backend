import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771942183712 implements MigrationInterface {
    name = 'Update1771942183712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "guestId"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferred_currency" SET DEFAULT 'RWF'`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferred_currency" SET DEFAULT 'RWF'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferred_currency" SET DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferred_currency" SET DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "guestId" uuid`);
    }

}
