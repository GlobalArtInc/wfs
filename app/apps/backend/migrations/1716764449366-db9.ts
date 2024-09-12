import { MigrationInterface, QueryRunner } from "typeorm";

export class Db91716764449366 implements MigrationInterface {
    name = 'Db91716764449366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player"
            ALTER COLUMN "type" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player"
            ALTER COLUMN "type"
            SET NOT NULL
        `);
    }

}
