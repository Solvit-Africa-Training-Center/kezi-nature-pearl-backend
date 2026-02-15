import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771147958435 implements MigrationInterface {
    name = 'Update1771147958435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "tax_amount"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sale_price"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cost_price"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "old_price" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "old_price"`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('draft', 'active', 'inactive', 'discontinued', 'out_of_stock')`);
        await queryRunner.query(`ALTER TABLE "products" ADD "status" "public"."products_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "cost_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sale_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "tax_amount" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

}
