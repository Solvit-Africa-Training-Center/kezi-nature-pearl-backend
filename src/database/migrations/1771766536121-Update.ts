import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771766536121 implements MigrationInterface {
    name = 'Update1771766536121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_3c3d2f43cf1669b9834e453af91" UNIQUE ("productId", "guestId")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_9007ffba411fd471dfe233dabfb" UNIQUE ("productId", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_9007ffba411fd471dfe233dabfb"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_3c3d2f43cf1669b9834e453af91"`);
    }

}
