import { MigrationInterface, QueryRunner } from "typeorm";

export class Db121717187755964 implements MigrationInterface {
    name = 'Db121717187755964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "PK_fb12e7826f8bbe68788292ea7eb"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "PK_7ac68b225db1617a06f19a20e57" PRIMARY KEY ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_7ac68b225db1617a06f19a20e57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "PK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_7ac68b225db1617a06f19a20e57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "PK_fb12e7826f8bbe68788292ea7eb" PRIMARY KEY ("id")
        `);
    }

}
