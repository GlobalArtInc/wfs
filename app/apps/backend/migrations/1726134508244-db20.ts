import { MigrationInterface, QueryRunner } from "typeorm";

export class Db201726134508244 implements MigrationInterface {
    name = 'Db201726134508244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "clan_member" DROP CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4"
        `);
        await queryRunner.query(`
            ALTER TABLE "clan_member"
            ADD CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "clan_member" DROP CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4"
        `);
        await queryRunner.query(`
            ALTER TABLE "clan_member"
            ADD CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
