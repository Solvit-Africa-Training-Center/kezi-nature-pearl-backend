import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771992906287 implements MigrationInterface {
    name = 'Update1771992906287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_526827d46f64e29d07c58e9bf08"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "currency_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_ab7608b30ed50ed6047d044e520" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_ab7608b30ed50ed6047d044e520"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "currency_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "currencyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_526827d46f64e29d07c58e9bf08" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
