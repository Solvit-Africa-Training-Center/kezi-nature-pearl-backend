import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1771318598237 implements MigrationInterface {
  name = 'Update1771318598237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."addresses_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP COLUMN "address_line2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "product_name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "product_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "address_line2" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."addresses_type_enum" AS ENUM('shipping', 'billing', 'both')`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "type" "public"."addresses_type_enum" NOT NULL`,
    );
  }
}
