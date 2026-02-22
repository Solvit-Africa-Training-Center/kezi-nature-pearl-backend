import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771748568050 implements MigrationInterface {
    name = 'Update1771748568050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_19bcf7bbb9c2beec008ecd811e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9007ffba411fd471dfe233dabf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2ee054d3192a9fed2f685c120"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "skin_type"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_skin_type_enum"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "helpful_count"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "title" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "status" "public"."reviews_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "helpful_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_skin_type_enum" AS ENUM('dry', 'oily', 'combination', 'sensitive', 'normal')`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "skin_type" "public"."reviews_skin_type_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_c2ee054d3192a9fed2f685c120" ON "contact_us" ("createdAt", "status") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9007ffba411fd471dfe233dabf" ON "reviews" ("productId", "userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19bcf7bbb9c2beec008ecd811e" ON "reviews" ("productId", "status") `);
    }

}
