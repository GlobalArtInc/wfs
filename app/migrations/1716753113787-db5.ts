import { MigrationInterface, QueryRunner } from "typeorm";

export class Db51716753113787 implements MigrationInterface {
    name = 'Db51716753113787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "client"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "client"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD "client" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "client" character varying NOT NULL
        `);
    }

}
