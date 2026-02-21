import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1771686784956 implements MigrationInterface {
    name = 'Update1771686784956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cartId" uuid NOT NULL, "productId" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total_price" numeric(10,2) NOT NULL, "orderId" uuid, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_4be3a424b9afbf6445222f89018" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_9e039229fb4b5a379ab79e887ad"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_4be3a424b9afbf6445222f89018"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_bbf4ec58c665ea1e66d47b6d1b6"`);
        await queryRunner.query(`DROP TABLE "items"`);
    }

}
