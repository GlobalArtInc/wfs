import { MigrationInterface, QueryRunner } from "typeorm";

export class Db61716762298405 implements MigrationInterface {
    name = 'Db61716762298405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_cb79378d0019560e5a4375a1a31"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f399c703e1f9c55a55c32b00500"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_72305cbdecd7e41be8be780f569"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_75bc4178df72b7d08da23af09ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "server"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "user_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "user_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "server"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD "server_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "server_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_03d5bfb4e894ed69354128c4223" FOREIGN KEY ("user_id", "user_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_77517c36788c8e04f9368ab7e2e" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_e019def41b68840e9e5960fda03" FOREIGN KEY ("user_id", "user_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_ffcbbf7f0ac57e38514680e561a" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_ffcbbf7f0ac57e38514680e561a"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_e019def41b68840e9e5960fda03"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_77517c36788c8e04f9368ab7e2e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_03d5bfb4e894ed69354128c4223"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "server_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "server_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "server" character varying
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
            ALTER TABLE "user_clan"
            ADD "server" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_75bc4178df72b7d08da23af09ec" FOREIGN KEY ("user_id", "user_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_72305cbdecd7e41be8be780f569" FOREIGN KEY ("server") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f399c703e1f9c55a55c32b00500" FOREIGN KEY ("user_id", "user_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_cb79378d0019560e5a4375a1a31" FOREIGN KEY ("server") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
