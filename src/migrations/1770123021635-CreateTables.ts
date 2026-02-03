import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1770123021635 implements MigrationInterface {
    name = 'CreateTables1770123021635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb207642da5918780cab878ff3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f310bb782ee3e7507b8c1ca243"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_66320c0e8a526229fd3f57684e0"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_f310bb782ee3e7507b8c1ca243d" PRIMARY KEY ("ingredientId")`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_f310bb782ee3e7507b8c1ca243d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP COLUMN "ingredientId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "ingredientId" json`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD "ingredientId_1" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_62c137800e2745574a7741e8de3" PRIMARY KEY ("ingredientId_1")`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD "ingredientId_2" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_62c137800e2745574a7741e8de3"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_50b86d622522087e0b0dd8159e9" PRIMARY KEY ("ingredientId_1", "ingredientId_2")`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" json`);
        await queryRunner.query(`CREATE INDEX "IDX_62c137800e2745574a7741e8de" ON "productIngredient" ("ingredientId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_7f5e68d4de75abee0e4519ad08" ON "productIngredient" ("ingredientId_2") `);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_62c137800e2745574a7741e8de3" FOREIGN KEY ("ingredientId_1") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_7f5e68d4de75abee0e4519ad08e" FOREIGN KEY ("ingredientId_2") REFERENCES "ingredients"("ingredientId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_7f5e68d4de75abee0e4519ad08e"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_62c137800e2745574a7741e8de3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f5e68d4de75abee0e4519ad08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_62c137800e2745574a7741e8de"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" uuid array`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_50b86d622522087e0b0dd8159e9"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_62c137800e2745574a7741e8de3" PRIMARY KEY ("ingredientId_1")`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP COLUMN "ingredientId_2"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_62c137800e2745574a7741e8de3"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP COLUMN "ingredientId_1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "ingredientId"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD "ingredientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_f310bb782ee3e7507b8c1ca243d" PRIMARY KEY ("ingredientId")`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD "productId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "PK_f310bb782ee3e7507b8c1ca243d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "PK_66320c0e8a526229fd3f57684e0" PRIMARY KEY ("productId", "ingredientId")`);
        await queryRunner.query(`CREATE INDEX "IDX_f310bb782ee3e7507b8c1ca243" ON "productIngredient" ("ingredientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb207642da5918780cab878ff3" ON "productIngredient" ("productId") `);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("ingredientId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
