import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771073142612 implements MigrationInterface {
    name = 'Update1771073142612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_53a68dc905777554b7f702791fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75eba1c6b1a66b09f2a97e6927"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddressId"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "orderId"`);
        await queryRunner.query(`CREATE TYPE "public"."addresses_type_enum" AS ENUM('shipping', 'billing', 'both')`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "type" "public"."addresses_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "fullName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "phone_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shipping_address" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddressId" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_75eba1c6b1a66b09f2a97e6927" ON "orders" ("order_number") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_53a68dc905777554b7f702791fa" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_53a68dc905777554b7f702791fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75eba1c6b1a66b09f2a97e6927"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddressId"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_address"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipping_address"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."addresses_type_enum"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddressId" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_75eba1c6b1a66b09f2a97e6927" ON "orders" ("order_number") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_53a68dc905777554b7f702791fa" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
