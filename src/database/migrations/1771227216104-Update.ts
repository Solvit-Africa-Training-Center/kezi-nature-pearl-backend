import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771227216104 implements MigrationInterface {
    name = 'Update1771227216104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."orders_orderstatus_enum" RENAME TO "orders_orderstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" TYPE "public"."orders_orderstatus_enum" USING "orderStatus"::"text"::"public"."orders_orderstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_orderstatus_enum" RENAME TO "orders_orderstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" TYPE "public"."orders_orderstatus_enum" USING "orderStatus"::"text"::"public"."orders_orderstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum_old" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" TYPE "public"."orders_orderstatus_enum_old" USING "orderStatus"::"text"::"public"."orders_orderstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_orderstatus_enum_old" RENAME TO "orders_orderstatus_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum_old" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" TYPE "public"."orders_orderstatus_enum_old" USING "orderStatus"::"text"::"public"."orders_orderstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderStatus" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_orderstatus_enum_old" RENAME TO "orders_orderstatus_enum"`);
    }

}
