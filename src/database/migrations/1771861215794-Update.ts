import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771861215794 implements MigrationInterface {
    name = 'Update1771861215794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "payment_status" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_payment_status_enum" RENAME TO "payments_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "status" TO "payment_status"`);
    }

}
