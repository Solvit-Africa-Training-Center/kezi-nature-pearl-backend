import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771921419129 implements MigrationInterface {
    name = 'Update1771921419129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "idempotencyKey" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_743b9fb1d2a059f2f7860418e4e" UNIQUE ("idempotencyKey")`);
        await queryRunner.query(`CREATE INDEX "IDX_743b9fb1d2a059f2f7860418e4" ON "payments" ("idempotencyKey") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_743b9fb1d2a059f2f7860418e4"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_743b9fb1d2a059f2f7860418e4e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "idempotencyKey"`);
    }

}
