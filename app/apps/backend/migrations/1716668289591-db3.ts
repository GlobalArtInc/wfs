import { MigrationInterface, QueryRunner } from "typeorm";

export class Db31716668289591 implements MigrationInterface {
    name = 'Db31716668289591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "setting"
                RENAME COLUMN "id" TO "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
                RENAME CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" TO "PK_1c4c95d773004250c157a744d6e"
        `);
        await queryRunner.query(`
            ALTER SEQUENCE "setting_id_seq"
            RENAME TO "setting_key_seq"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting" DROP CONSTRAINT "PK_1c4c95d773004250c157a744d6e"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting" DROP COLUMN "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
            ADD "key" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
            ADD CONSTRAINT "PK_1c4c95d773004250c157a744d6e" PRIMARY KEY ("key")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "setting" DROP CONSTRAINT "PK_1c4c95d773004250c157a744d6e"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting" DROP COLUMN "key"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
            ADD "key" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
            ADD CONSTRAINT "PK_1c4c95d773004250c157a744d6e" PRIMARY KEY ("key")
        `);
        await queryRunner.query(`
            ALTER SEQUENCE "setting_key_seq"
            RENAME TO "setting_id_seq"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
                RENAME CONSTRAINT "PK_1c4c95d773004250c157a744d6e" TO "PK_fcb21187dc6094e24a48f677bed"
        `);
        await queryRunner.query(`
            ALTER TABLE "setting"
                RENAME COLUMN "key" TO "id"
        `);
    }

}
