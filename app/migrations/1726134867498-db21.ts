import { MigrationInterface, QueryRunner } from "typeorm";

export class Db211726134867498 implements MigrationInterface {
    name = 'Db211726134867498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "clan"
            ADD CONSTRAINT "UQ_87994d85268a72aca8ec16d0ce6" UNIQUE ("id", "server")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "clan" DROP CONSTRAINT "UQ_87994d85268a72aca8ec16d0ce6"
        `);
    }

}
