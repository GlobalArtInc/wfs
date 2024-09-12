import { MigrationInterface, QueryRunner } from "typeorm";

export class Db161725965806438 implements MigrationInterface {
    name = 'Db161725965806438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player"
            ADD CONSTRAINT "UQ_c28e07e62591410385846072b66" UNIQUE ("nickname")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player" DROP CONSTRAINT "UQ_c28e07e62591410385846072b66"
        `);
    }

}
