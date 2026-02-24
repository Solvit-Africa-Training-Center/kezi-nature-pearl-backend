import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771914950922 implements MigrationInterface {
    name = 'Update1771914950922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(3) NOT NULL, "name" character varying(50) NOT NULL, "symbol" text NOT NULL, "symbol_position" character varying NOT NULL DEFAULT 'before', "decimal_places" integer NOT NULL DEFAULT '2', "decimal_separator" character varying NOT NULL DEFAULT '.', "thousands_separator" character varying NOT NULL DEFAULT ',', "is_base" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "is_default" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exchangerate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "from_currency_code" character varying(3) NOT NULL, "to_currency_code" character varying(3) NOT NULL, "rate" numeric(10,4) NOT NULL, "date" date NOT NULL, "fetched_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_3bda09caa50049820a21032d2b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billing_address"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "preferred_currency" character varying(3) NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "exchangerate" ADD CONSTRAINT "FK_a52416e5756f0f95cf599617e3b" FOREIGN KEY ("from_currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchangerate" ADD CONSTRAINT "FK_d213270fd5821e6418bf052ecaa" FOREIGN KEY ("to_currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exchangerate" DROP CONSTRAINT "FK_d213270fd5821e6418bf052ecaa"`);
        await queryRunner.query(`ALTER TABLE "exchangerate" DROP CONSTRAINT "FK_a52416e5756f0f95cf599617e3b"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "preferred_currency"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "billing_address" jsonb`);
        await queryRunner.query(`DROP TABLE "exchangerate"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
