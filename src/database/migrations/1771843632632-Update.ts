import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771843632632 implements MigrationInterface {
    name = 'Update1771843632632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "skin_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_preferences_skin_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "allergies"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "preferred_categories"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "skin_tone"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gateway_response"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "guestId" uuid`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "kind" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "provider" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "UQ_b6202d1cacc63a0b9c8dac2abd4"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "reference" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "reference" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "UQ_b6202d1cacc63a0b9c8dac2abd4" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "kind"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "guestId"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "gateway_response" jsonb`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "skin_tone" character varying`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "preferred_categories" uuid array`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "allergies" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."user_preferences_skin_type_enum" AS ENUM('dry', 'oily', 'combination', 'sensitive', 'normal')`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "skin_type" "public"."user_preferences_skin_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_b6202d1cacc63a0b9c8dac2abd4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
