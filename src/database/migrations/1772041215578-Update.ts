import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1772041215578 implements MigrationInterface {
    name = 'Update1772041215578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP CONSTRAINT "FK_7878b93342d306307315e2acfdb"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "guestId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff30e298489819beac7cb034fc"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ff30e298489819beac7cb034fc" ON "inventory_log" ("productId", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ff30e298489819beac7cb034fc"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ff30e298489819beac7cb034fc" ON "inventory_log" ("createdAt", "productId") `);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "guestId"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD "orderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD CONSTRAINT "FK_7878b93342d306307315e2acfdb" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
