import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771987205357 implements MigrationInterface {
    name = 'Update1771987205357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" RENAME COLUMN "preferred_currency" TO "currency_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "currency_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_ab7608b30ed50ed6047d044e520" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_ab7608b30ed50ed6047d044e520"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "currency_id" character varying(3) NOT NULL DEFAULT 'RWF'`);
        await queryRunner.query(`ALTER TABLE "user_preferences" RENAME COLUMN "currency_id" TO "preferred_currency"`);
    }

}
