import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771641717214 implements MigrationInterface {
    name = 'Update1771641717214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "guestId" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9007ffba411fd471dfe233dabf"`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9007ffba411fd471dfe233dabf" ON "reviews" ("userId", "productId") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9007ffba411fd471dfe233dabf"`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9007ffba411fd471dfe233dabf" ON "reviews" ("productId", "userId") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "guestId"`);
    }

}
