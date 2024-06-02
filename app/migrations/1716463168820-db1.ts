import { MigrationInterface, QueryRunner } from "typeorm";

export class Db11716463168820 implements MigrationInterface {
    name = 'Db11716463168820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_46eb8e20e115f05b0ab11dfc89"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_46eb8e20e115f05b0ab11dfc89" ON "player_stat" ("param")
        `);
    }

}
