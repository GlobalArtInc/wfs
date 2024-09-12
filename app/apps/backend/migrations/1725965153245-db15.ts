import { MigrationInterface, QueryRunner } from "typeorm";

export class Db151725965153245 implements MigrationInterface {
    name = 'Db151725965153245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_achievement" DROP CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_stat" DROP CONSTRAINT "FK_e138afcd63435062e8de1effdca"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_achievement"
            ADD CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "player_stat"
            ADD CONSTRAINT "FK_e138afcd63435062e8de1effdca" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_stat" DROP CONSTRAINT "FK_e138afcd63435062e8de1effdca"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_achievement" DROP CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_69f56e93fa878ce7bf44d8022a4"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_stat"
            ADD CONSTRAINT "FK_e138afcd63435062e8de1effdca" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "player_achievement"
            ADD CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
