import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { PlayerTypeEnum } from './player.enums';

@Entity('player')
@Unique(['nickname', 'server'])
export class PlayerEntity {
  @PrimaryColumn('character varying')
  id: string;

  @Column('int', { default: 0 })
  vip_level: number;

  @Column('character varying')
  server: string;

  @Column('enum', { enum: PlayerTypeEnum, nullable: true })
  type: PlayerTypeEnum;

  @Column('character varying', { name: 'user_id', nullable: true })
  user_id: string;

  @Column('character varying')
  nickname: string;

  @Column('int', { nullable: true })
  experience: number;

  @Column('int', { nullable: true })
  rank_id: number;

  @Column('int', { default: 1 })
  is_transparent: number;

  @Column('int', { nullable: true })
  clan_id: number;

  @Column('character varying', { nullable: true })
  clan_name: string;

  @Column('int')
  kill: number;

  @Column('int')
  friendly_kills: number;

  @Column('int')
  kills: number;

  @Column('int')
  death: number;

  @Column('float')
  pvp: string;

  @Column('int')
  pve_kill: number;

  @Column('int')
  pve_friendly_kills: number;

  @Column('int')
  pve_kills: number;

  @Column('int')
  pve_death: number;

  @Column('float')
  pve: string;

  @Column('int')
  playtime: number;

  @Column('int')
  playtime_h: number;

  @Column('int')
  playtime_m: number;

  @Column('character varying', { name: 'favoritPVP', nullable: true })
  favoritPVP: string;

  @Column('character varying', { name: 'favoritPVE', nullable: true })
  favoritPVE: string;

  @Column('int')
  pve_wins: number;

  @Column('int')
  pvp_wins: number;

  @Column('int')
  pve_lost: number;

  @Column('int')
  pvp_lost: number;

  @Column('int')
  pve_all: number;

  @Column('int')
  pvp_all: number;

  @Column('float')
  pvpwl: number;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => PlayerStatEntity, (playerStat) => playerStat.player, {
    cascade: true,
  })
  playerStats: PlayerStatEntity[];

  @OneToMany(() => PlayerAchievementEntity, (playerStat) => playerStat.player, {
    cascade: true,
  })
  playerAchievements: PlayerAchievementEntity[];
}

@Entity('player_achievement')
export class PlayerAchievementEntity {
  @PrimaryColumn('character varying')
  playerId: string;

  @PrimaryColumn('character varying', { name: 'achievement_id' })
  achievement_id: string;

  @Column('int')
  progress: number;

  @Column('character varying', { name: 'completion_time', default: null })
  completion_time: string;

  @ManyToOne(() => PlayerEntity, (player) => player.playerStats, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  player: PlayerEntity;
}

@Index(['playerId', 'param'])
@Entity('player_stat')
export class PlayerStatEntity {
  @PrimaryColumn('character varying')
  playerId: string;

  @PrimaryColumn('character varying')
  param: string;

  @Column('bigint')
  value: number;

  @ManyToOne(() => PlayerEntity, (player) => player.playerStats, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  player: PlayerEntity;
}
