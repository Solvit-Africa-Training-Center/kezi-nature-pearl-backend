import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771320714818 implements MigrationInterface {
    name = 'Update1771320714818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'pending', "reference" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, CONSTRAINT "UQ_0b12a144bdc7678b6ddb0b913fc" UNIQUE ("reference"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "province" character varying`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "district" character varying`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "sector" character varying`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "address_line1" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "address_line1" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_a6e45c89cfbe8d92840266fd30f"`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "address_line1" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "address_line1" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "sector"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "district"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "province"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
    }

}
