import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1772019491665 implements MigrationInterface {
    name = 'Update1772019491665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb"`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_us" DROP CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb"`);
        await queryRunner.query(`ALTER TABLE "contact_us" ADD CONSTRAINT "FK_fdc3449ff4d12de09343c2a54fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
