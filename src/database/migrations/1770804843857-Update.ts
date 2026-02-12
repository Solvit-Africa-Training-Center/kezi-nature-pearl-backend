import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1770804843857 implements MigrationInterface {
    name = 'Update1770804843857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_820a4c09ddad44884a97378d336"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "billingAddressId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "billingAddressId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_820a4c09ddad44884a97378d336" FOREIGN KEY ("billingAddressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
