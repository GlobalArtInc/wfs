import { MigrationInterface, QueryRunner } from "typeorm";

export class Db171725966228777 implements MigrationInterface {
    name = 'Db171725966228777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player" DROP CONSTRAINT "UQ_c28e07e62591410385846072b66"
        `);
        await queryRunner.query(`
            ALTER TABLE "player"
            ADD CONSTRAINT "UQ_4d08d25530219ab280ec5c42c9e" UNIQUE ("nickname", "server")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player" DROP CONSTRAINT "UQ_4d08d25530219ab280ec5c42c9e"
        `);
        await queryRunner.query(`
            ALTER TABLE "player"
            ADD CONSTRAINT "UQ_c28e07e62591410385846072b66" UNIQUE ("nickname")
        `);
    }

}
