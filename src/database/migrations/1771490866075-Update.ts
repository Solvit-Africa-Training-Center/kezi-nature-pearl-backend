import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1771490866075 implements MigrationInterface {
  name = 'Update1771490866075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "idempotencyKey" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_743b9fb1d2a059f2f7860418e4e" UNIQUE ("idempotencyKey")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum" RENAME TO "payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('card', 'mom')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING "payment_method"::"text"::"public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum" RENAME TO "payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('card', 'mom')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING "payment_method"::"text"::"public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_743b9fb1d2a059f2f7860418e4" ON "payments" ("idempotencyKey") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_743b9fb1d2a059f2f7860418e4"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('card', 'upi', 'cod', 'bank_transfer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum_old" RENAME TO "payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('card', 'upi', 'cod', 'bank_transfer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum_old" RENAME TO "payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_743b9fb1d2a059f2f7860418e4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "idempotencyKey"`,
    );
  }
}
