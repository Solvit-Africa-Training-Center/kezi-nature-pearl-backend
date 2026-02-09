import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1770635086071 implements MigrationInterface {
    name = 'Update1770635086071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_e8c788030f2c88cbccf6965328c"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_e8c788030f2c88cbccf6965328c" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
