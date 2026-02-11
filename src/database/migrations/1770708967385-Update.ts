import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1770708967385 implements MigrationInterface {
    name = 'Update1770708967385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" ALTER COLUMN "name" SET NOT NULL`);
    }

}
