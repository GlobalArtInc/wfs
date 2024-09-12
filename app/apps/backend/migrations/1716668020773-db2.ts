import { MigrationInterface, QueryRunner } from "typeorm";

export class Db21716668020773 implements MigrationInterface {
    name = 'Db21716668020773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "setting" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "value" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_46eb8e20e115f05b0ab11dfc89" ON "player_stat" ("param")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_46eb8e20e115f05b0ab11dfc89"
        `);
        await queryRunner.query(`
            DROP TABLE "setting"
        `);
    }

}
