import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnums1769591901100 implements MigrationInterface {
  name = 'CreateEnums1769591901100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TYPE "public"."categories_name_enum" AS ENUM ('kids', 'adults', 'elders')`);

    await queryRunner.query(`
    CREATE TYPE "public"."products_status_enum" AS ENUM ('active', 'inactive', 'discontinued')`);

    await queryRunner.query(`
    CREATE TYPE "public"."users_role_enum" AS ENUM ('customer', 'admin')`);

    await queryRunner.query(`
    CREATE TYPE "public"."users_status_enum" AS ENUM ('active', 'inactive')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TYPE IF EXISTS "public"."categories_name_enum" CASCADE
  `);

    await queryRunner.query(`
    DROP TYPE IF EXISTS "public"."products_status_enum" CASCADE
  `);

    await queryRunner.query(`
    DROP TYPE IF EXISTS "public"."users_role_enum" CASCADE
  `);

    await queryRunner.query(`
    DROP TYPE IF EXISTS "public"."users_status_enum" CASCADE
  `);
  }
}
