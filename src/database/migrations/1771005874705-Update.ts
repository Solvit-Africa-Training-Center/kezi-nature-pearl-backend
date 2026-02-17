import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1771005874705 implements MigrationInterface {
  name = 'Update1771005874705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_4c9fb58de893725258746385e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
