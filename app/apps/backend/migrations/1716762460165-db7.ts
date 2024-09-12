import { MigrationInterface, QueryRunner } from "typeorm";

export class Db71716762460165 implements MigrationInterface {
    name = 'Db71716762460165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_cd841a2bbe51f333a825b96e6f1"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip" DROP COLUMN "member_client"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_86bad27a12c12a01e790f85a131" FOREIGN KEY ("member_id", "member_id") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_86bad27a12c12a01e790f85a131"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD "member_client" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_cd841a2bbe51f333a825b96e6f1" FOREIGN KEY ("member_id", "member_client") REFERENCES "user"("id", "client") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
