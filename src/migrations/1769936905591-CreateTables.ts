import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1769936905591 implements MigrationInterface {
    name = 'CreateTables1769936905591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e850707b5c70fa49ea50ef2f59f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e850707b5c70fa49ea50ef2f59f" FOREIGN KEY ("profile") REFERENCES "files"("fileId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e850707b5c70fa49ea50ef2f59f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e850707b5c70fa49ea50ef2f59f" FOREIGN KEY ("profile") REFERENCES "files"("fileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
