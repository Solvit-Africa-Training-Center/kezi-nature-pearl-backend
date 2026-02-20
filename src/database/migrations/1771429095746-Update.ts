import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771429095746 implements MigrationInterface {
    name = 'Update1771429095746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3c324ca49dabde7ffc0ef64675"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "reference" character varying, "orderId" uuid, CONSTRAINT "UQ_dd85cc865e0c3d5d4be095d3f3f" UNIQUE ("reference"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."payments_payment_method_enum" RENAME TO "payments_payment_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('card', 'momo')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING "payment_method"::"text"::"public"."payments_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_2fdbbae70ff802bc8b703ee7c5c" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_2fdbbae70ff802bc8b703ee7c5c"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('card', 'mom')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_payment_method_enum_old" RENAME TO "payments_payment_method_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3c324ca49dabde7ffc0ef64675" ON "payments" ("transaction_id") `);
    }

}
