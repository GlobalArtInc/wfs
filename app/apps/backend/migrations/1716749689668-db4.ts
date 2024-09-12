import { MigrationInterface, QueryRunner } from "typeorm";

export class Db41716749689668 implements MigrationInterface {
    name = 'Db41716749689668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "user_client" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD "user_client" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD "member_client" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_fed09e6f9c08a5031ba1e3e9701" PRIMARY KEY ("id", "client")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_75bc4178df72b7d08da23af09ec" FOREIGN KEY ("user_id", "user_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f399c703e1f9c55a55c32b00500" FOREIGN KEY ("user_id", "user_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_cd841a2bbe51f333a825b96e6f1" FOREIGN KEY ("member_id", "member_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_cd841a2bbe51f333a825b96e6f1"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f399c703e1f9c55a55c32b00500"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_75bc4178df72b7d08da23af09ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_fed09e6f9c08a5031ba1e3e9701"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "vip" DROP COLUMN "member_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "user_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "user_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd" FOREIGN KEY ("member_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_7ac68b225db1617a06f19a20e57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
