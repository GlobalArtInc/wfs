import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1716453841307 implements MigrationInterface {
    name = 'Init1716453841307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "achievement" (
                "id" SERIAL NOT NULL,
                "achievement_id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_a61b8830fef7d2bd74d87c87e15" PRIMARY KEY ("id", "achievement_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "clan" (
                "clan_id" character varying NOT NULL,
                "id" integer NOT NULL,
                "server" character varying NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_84b704e2b3a97e089891c4928f6" PRIMARY KEY ("clan_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "clan_member" (
                "clan_id" character varying NOT NULL,
                "nickname" character varying NOT NULL,
                "rank_id" character varying NOT NULL,
                "clan_points" character varying NOT NULL,
                "clan_role" character varying NOT NULL,
                CONSTRAINT "PK_e40a2f129735281b6d41dce9d68" PRIMARY KEY ("clan_id", "nickname")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "event_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" character varying NOT NULL,
                "data" character varying NOT NULL,
                CONSTRAINT "PK_a9ae147d81760a658c432e3f31c" PRIMARY KEY ("id", "event_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "guild" (
                "id" character varying NOT NULL,
                "default_channel" character varying NOT NULL,
                "language" character varying NOT NULL,
                CONSTRAINT "PK_cfbbd0a2805cab7053b516068a3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."player_type_enum" AS ENUM('open', 'hidden', 'inactive', 'nickname_changed')
        `);
        await queryRunner.query(`
            CREATE TABLE "player" (
                "id" character varying NOT NULL,
                "vip_level" integer NOT NULL DEFAULT '0',
                "server" character varying NOT NULL,
                "type" "public"."player_type_enum" NOT NULL,
                "user_id" character varying,
                "nickname" character varying NOT NULL,
                "experience" integer,
                "rank_id" integer,
                "is_transparent" integer NOT NULL DEFAULT '1',
                "clan_id" integer,
                "clan_name" character varying,
                "kill" integer NOT NULL,
                "friendly_kills" integer NOT NULL,
                "kills" integer NOT NULL,
                "death" integer NOT NULL,
                "pvp" double precision NOT NULL,
                "pve_kill" integer NOT NULL,
                "pve_friendly_kills" integer NOT NULL,
                "pve_kills" integer NOT NULL,
                "pve_death" integer NOT NULL,
                "pve" double precision NOT NULL,
                "playtime" integer NOT NULL,
                "playtime_h" integer NOT NULL,
                "playtime_m" integer NOT NULL,
                "favoritPVP" character varying,
                "favoritPVE" character varying,
                "pve_wins" integer NOT NULL,
                "pvp_wins" integer NOT NULL,
                "pve_lost" integer NOT NULL,
                "pvp_lost" integer NOT NULL,
                "pve_all" integer NOT NULL,
                "pvp_all" integer NOT NULL,
                "pvpwl" double precision NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "player_achievement" (
                "player_id" character varying NOT NULL,
                "achievement_id" character varying NOT NULL,
                "progress" integer NOT NULL,
                "completion_time" character varying,
                CONSTRAINT "PK_8955bbdf62b5d8efb7ee572623e" PRIMARY KEY ("player_id", "achievement_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "player_stat" (
                "player_id" character varying NOT NULL,
                "param" character varying NOT NULL,
                "value" integer NOT NULL,
                CONSTRAINT "PK_c2e245ced526853ba824a56b81e" PRIMARY KEY ("player_id", "param")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_46eb8e20e115f05b0ab11dfc89" ON "player_stat" ("param")
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" character varying NOT NULL,
                "client" character varying NOT NULL,
                "default_server" character varying NOT NULL,
                "language" character varying NOT NULL,
                "username" character varying,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_player" (
                "id" SERIAL NOT NULL,
                "client" character varying NOT NULL,
                "name" character varying NOT NULL,
                "user_id" character varying,
                "server" character varying,
                CONSTRAINT "PK_fb12e7826f8bbe68788292ea7eb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_clan" (
                "id" SERIAL NOT NULL,
                "client" character varying NOT NULL,
                "name" character varying NOT NULL,
                "user_id" character varying,
                "server" character varying,
                CONSTRAINT "PK_7f3da65917b252e500cea79daed" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "server" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_f8b8af38bdc23b447c0a57c7937" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "vip" (
                "id" SERIAL NOT NULL,
                "created_at" integer NOT NULL,
                "member_id" character varying,
                "type" character varying,
                CONSTRAINT "PK_5ee4e78e1cd6ac143f88d172500" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "vip_type" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_d2b62349101aaaaf37c762dd3d6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "weapon" (
                "id" character varying NOT NULL,
                "category" character varying NOT NULL,
                "name_ru" character varying,
                "name_en" character varying,
                "updated_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_41fe726bde6432339c1d4595d29" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "weapon_category" (
                "id" SERIAL NOT NULL,
                "category_id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_d20792712f2fcdac31e41f0ace0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "clan_member"
            ADD CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "player_achievement"
            ADD CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "player_stat"
            ADD CONSTRAINT "FK_e138afcd63435062e8de1effdca" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_69f56e93fa878ce7bf44d8022a4" FOREIGN KEY ("default_server") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_7ac68b225db1617a06f19a20e57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player"
            ADD CONSTRAINT "FK_72305cbdecd7e41be8be780f569" FOREIGN KEY ("server") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan"
            ADD CONSTRAINT "FK_cb79378d0019560e5a4375a1a31" FOREIGN KEY ("server") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd" FOREIGN KEY ("member_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "vip"
            ADD CONSTRAINT "FK_ec0c4e20892e30c5e2137f35e1d" FOREIGN KEY ("type") REFERENCES "vip_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`INSERT INTO "server" VALUES ('ru', 'RU');`)
        await queryRunner.query(`INSERT INTO "server" VALUES ('int', 'EU/US');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_ec0c4e20892e30c5e2137f35e1d"
        `);
        await queryRunner.query(`
            ALTER TABLE "vip" DROP CONSTRAINT "FK_7d8ebfc8931c53c0e17314ae5dd"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_cb79378d0019560e5a4375a1a31"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_clan" DROP CONSTRAINT "FK_f3f39097618b4dfebc2ae134d8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_72305cbdecd7e41be8be780f569"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_player" DROP CONSTRAINT "FK_7ac68b225db1617a06f19a20e57"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_69f56e93fa878ce7bf44d8022a4"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_stat" DROP CONSTRAINT "FK_e138afcd63435062e8de1effdca"
        `);
        await queryRunner.query(`
            ALTER TABLE "player_achievement" DROP CONSTRAINT "FK_875d5d6f99a388fd11cc36e9299"
        `);
        await queryRunner.query(`
            ALTER TABLE "clan_member" DROP CONSTRAINT "FK_8a3071b49ec64984aaa0132dbb4"
        `);
        await queryRunner.query(`
            DROP TABLE "weapon_category"
        `);
        await queryRunner.query(`
            DROP TABLE "weapon"
        `);
        await queryRunner.query(`
            DROP TABLE "vip_type"
        `);
        await queryRunner.query(`
            DROP TABLE "vip"
        `);
        await queryRunner.query(`
            DROP TABLE "server"
        `);
        await queryRunner.query(`
            DROP TABLE "user_clan"
        `);
        await queryRunner.query(`
            DROP TABLE "user_player"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_46eb8e20e115f05b0ab11dfc89"
        `);
        await queryRunner.query(`
            DROP TABLE "player_stat"
        `);
        await queryRunner.query(`
            DROP TABLE "player_achievement"
        `);
        await queryRunner.query(`
            DROP TABLE "player"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."player_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "guild"
        `);
        await queryRunner.query(`
            DROP TABLE "events"
        `);
        await queryRunner.query(`
            DROP TABLE "clan_member"
        `);
        await queryRunner.query(`
            DROP TABLE "clan"
        `);
        await queryRunner.query(`
            DROP TABLE "achievement"
        `);
    }

}
