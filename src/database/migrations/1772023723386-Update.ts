import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1772023723386 implements MigrationInterface {
    name = 'Update1772023723386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP CONSTRAINT "FK_db096682985e736434d99e02564"`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP CONSTRAINT "FK_1459e9fcbfab9332258641a7ae9"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_ab7608b30ed50ed6047d044e520"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_195c571baada405f19e8a18466f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP CONSTRAINT "FK_7878b93342d306307315e2acfdb"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_af435964834e1879ccbe1a14b29"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD "orderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "cartId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff30e298489819beac7cb034fc"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ff30e298489819beac7cb034fc" ON "inventory_log" ("productId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD CONSTRAINT "FK_db096682985e736434d99e02564" FOREIGN KEY ("from_currency_code") REFERENCES "currencies"("code") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD CONSTRAINT "FK_1459e9fcbfab9332258641a7ae9" FOREIGN KEY ("to_currency_code") REFERENCES "currencies"("code") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_ab7608b30ed50ed6047d044e520" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_195c571baada405f19e8a18466f" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_af435964834e1879ccbe1a14b29" FOREIGN KEY ("respondedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD CONSTRAINT "FK_7878b93342d306307315e2acfdb" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP CONSTRAINT "FK_7878b93342d306307315e2acfdb"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_af435964834e1879ccbe1a14b29"`);
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_195c571baada405f19e8a18466f"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_ab7608b30ed50ed6047d044e520"`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP CONSTRAINT "FK_1459e9fcbfab9332258641a7ae9"`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" DROP CONSTRAINT "FK_db096682985e736434d99e02564"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff30e298489819beac7cb034fc"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ff30e298489819beac7cb034fc" ON "inventory_log" ("createdAt", "productId") `);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "cartId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_coupon" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD "orderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_coupon" ADD CONSTRAINT "FK_3dbe70de5d53c0491d3970d20c0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_af435964834e1879ccbe1a14b29" FOREIGN KEY ("respondedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD CONSTRAINT "FK_7878b93342d306307315e2acfdb" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_195c571baada405f19e8a18466f" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_ab7608b30ed50ed6047d044e520" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD CONSTRAINT "FK_1459e9fcbfab9332258641a7ae9" FOREIGN KEY ("to_currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rate" ADD CONSTRAINT "FK_db096682985e736434d99e02564" FOREIGN KEY ("from_currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
