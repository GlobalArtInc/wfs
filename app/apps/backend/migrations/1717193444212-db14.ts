import { MigrationInterface, QueryRunner } from "typeorm";

export class Db141717193444212 implements MigrationInterface {
    name = 'Db141717193444212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_77517c36788c8e04f9368ab7e2e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_ffcbbf7f0ac57e38514680e561a"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP COLUMN "server_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP COLUMN "server_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD "server_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD "server_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_ffcbbf7f0ac57e38514680e561a" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_77517c36788c8e04f9368ab7e2e" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
