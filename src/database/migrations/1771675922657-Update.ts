import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1771675922657 implements MigrationInterface {
  name = 'Update1771675922657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "orderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_005269d8574e6fac0493715c308" FOREIGN KEY ("id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_005269d8574e6fac0493715c308"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "orderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
