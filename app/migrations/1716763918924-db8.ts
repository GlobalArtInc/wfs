import { MigrationInterface, QueryRunner } from "typeorm";

export class Db81716763918924 implements MigrationInterface {
    name = 'Db81716763918924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_03d5bfb4e894ed69354128c4223"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_e019def41b68840e9e5960fda03"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_86bad27a12c12a01e790f85a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_fed09e6f9c08a5031ba1e3e9701"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_7ac68b225db1617a06f19a20e57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd" FOREIGN KEY ("member_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_fed09e6f9c08a5031ba1e3e9701" PRIMARY KEY ("id", "client")
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_86bad27a12c12a01e790f85a131" FOREIGN KEY ("member_id", "member_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_e019def41b68840e9e5960fda03" FOREIGN KEY ("user_id", "user_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_03d5bfb4e894ed69354128c4223" FOREIGN KEY ("user_id", "user_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
