import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771859739931 implements MigrationInterface {
    name = 'Update1771859739931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_2fdbbae70ff802bc8b703ee7c5c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_348b1d0f5ab891d71c445b888b"`);
        await queryRunner.query(`ALTER TABLE "wishlist" DROP CONSTRAINT "UQ_2ca6e3d0bd9835eabd2668d5151"`);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "orderId" TO "paymentId"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "paymentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "paymentId" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "transaction_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d" UNIQUE ("transaction_id")`);
        await queryRunner.query(`ALTER TABLE "transactions" RENAME COLUMN "paymentId" TO "orderId"`);
        await queryRunner.query(`ALTER TABLE "wishlist" ADD CONSTRAINT "UQ_2ca6e3d0bd9835eabd2668d5151" UNIQUE ("userId", "productId")`);
        await queryRunner.query(`CREATE INDEX "IDX_348b1d0f5ab891d71c445b888b" ON "wishlist" ("createdAt", "userId") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_2fdbbae70ff802bc8b703ee7c5c" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
