import { MigrationInterface, QueryRunner } from "typeorm";

export class Db191726087655776 implements MigrationInterface {
    name = 'Db191726087655776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e138afcd63435062e8de1effdc"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_46eb8e20e115f05b0ab11dfc89"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_c2e245ced526853ba824a56b81" ON "player_stat" ("player_id", "param")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_c2e245ced526853ba824a56b81"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_46eb8e20e115f05b0ab11dfc89" ON "player_stat" ("param")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e138afcd63435062e8de1effdc" ON "player_stat" ("player_id")
        `);
    }

}
