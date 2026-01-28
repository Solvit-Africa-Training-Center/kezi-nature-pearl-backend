import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTables1769591901130 implements MigrationInterface {
  name = 'CreateUserTables1769591901130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passwordresettoken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d991d59a052bf17f40db117211" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "emailverificationtoken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a06541d70e8e77c1252ae6511f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "profile" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "phoneNumber" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "emailVerifiedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("ingredientId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ea762d9f387ef1c0be08ac990eb" PRIMARY KEY ("ingredientId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("productId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "productCode" character varying NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'active', "categoryId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7b3b507508cd0f86a5b2e923459" PRIMARY KEY ("productId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("categoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."categories_name_enum" NOT NULL DEFAULT 'adults', "description" text NOT NULL, CONSTRAINT "PK_c9594c262e6781893a1068d91be" PRIMARY KEY ("categoryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "productIngredient" ("productId" uuid NOT NULL, "ingredientId" uuid NOT NULL, CONSTRAINT "PK_66320c0e8a526229fd3f57684e0" PRIMARY KEY ("productId", "ingredientId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb207642da5918780cab878ff3" ON "productIngredient" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f310bb782ee3e7507b8c1ca243" ON "productIngredient" ("ingredientId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("ingredientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f310bb782ee3e7507b8c1ca243"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb207642da5918780cab878ff3"`,
    );
    await queryRunner.query(`DROP TABLE "productIngredient"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "emailverificationtoken"`);
    await queryRunner.query(`DROP TABLE "passwordresettoken"`);
  }
}
