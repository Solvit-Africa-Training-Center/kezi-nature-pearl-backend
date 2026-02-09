import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1770583152545 implements MigrationInterface {
    name = 'Update1770583152545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum" RENAME TO "files_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum" AS ENUM('image', 'video', 'raw', 'auto')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum" USING "type"::"text"::"public"."files_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum" RENAME TO "files_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum" AS ENUM('image', 'video', 'raw', 'auto')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum" USING "type"::"text"::"public"."files_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum_old" AS ENUM('image', 'video')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum_old" USING "type"::"text"::"public"."files_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum_old" RENAME TO "files_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."files_type_enum_old" AS ENUM('image', 'video')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "type" TYPE "public"."files_type_enum_old" USING "type"::"text"::"public"."files_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."files_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_type_enum_old" RENAME TO "files_type_enum"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "name"`);
    }

}
