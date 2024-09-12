import { MigrationInterface, QueryRunner } from "typeorm";

export class Db131717189431084 implements MigrationInterface {
    name = 'Db131717189431084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "PK_7f3da65917b252e500cea79daed"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "PK_f3f39097618b4dfebc2ae134d8e" PRIMARY KEY ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "PK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "PK_7f3da65917b252e500cea79daed" PRIMARY KEY ("id")
        `);
    }

}
