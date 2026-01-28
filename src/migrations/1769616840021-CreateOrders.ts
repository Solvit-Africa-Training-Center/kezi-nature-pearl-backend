import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrders1769616840021 implements MigrationInterface {
    name = 'CreateOrders1769616840021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "productIngredient" ("productId" uuid NOT NULL, "ingredientId" uuid NOT NULL, CONSTRAINT "PK_66320c0e8a526229fd3f57684e0" PRIMARY KEY ("productId", "ingredientId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb207642da5918780cab878ff3" ON "productIngredient" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f310bb782ee3e7507b8c1ca243" ON "productIngredient" ("ingredientId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("ingredientId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('customer', 'admin', 'superadmin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f310bb782ee3e7507b8c1ca243"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb207642da5918780cab878ff3"`);
        await queryRunner.query(`DROP TABLE "productIngredient"`);
    }

}
