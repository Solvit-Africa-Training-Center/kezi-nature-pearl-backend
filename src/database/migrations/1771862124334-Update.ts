import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771862124334 implements MigrationInterface {
    name = 'Update1771862124334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_721af04ac41f7598ecb59f5e66f" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
