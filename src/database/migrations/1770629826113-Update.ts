import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1770629826113 implements MigrationInterface {
  name = 'Update1770629826113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "expiry_duration"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "benefits"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "how_to_use"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "how_to_use" text`);
    await queryRunner.query(`ALTER TABLE "products" ADD "benefits" text array`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "expiry_duration" integer`,
    );
  }
}
