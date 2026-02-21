import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771689576731 implements MigrationInterface {
    name = 'Update1771689576731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
