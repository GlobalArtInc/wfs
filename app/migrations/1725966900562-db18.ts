import { MigrationInterface, QueryRunner } from "typeorm";

export class Db181725966900562 implements MigrationInterface {
    name = 'Db181725966900562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_stat"
            ALTER COLUMN "value" TYPE bigint
        `);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_stat"
            ALTER COLUMN "value" TYPE int
        `);
        
    }

}
