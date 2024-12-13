import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { PlayerTypeEnum } from './player.enums';

@Entity('player')
@Unique(['nickname', 'server'])
export class PlayerEntity {
  @PrimaryColumn('character varying')
  id: string;

  @Column('int', { default: 0 })
  vipLevel: number;

  @Column('character varying')
  server: string;

  @Column('enum', { enum: PlayerTypeEnum, nullable: true })
  type: PlayerTypeEnum;

  @Column('character varying', { name: 'user_id', nullable: true })
  userId: string;

  @Column('character varying')
  nickname: string;

  @Column('int', { nullable: true })
  experience: number;

  @Column('int', { nullable: true })
  rankId: number;

  @Column('int', { default: 1 })
  isTransparent: number;

  @Column('int', { nullable: true })
  clanId: number;

  @Column('character varying', { nullable: true })
  clanName: string;

  @Column('int')
  kill: number;

  @Column('int')
  friendlyKills: number;

  @Column('int')
  kills: number;

  @Column('int')
  death: number;

  @Column('float')
  pvp: string;

  @Column('int')
  pveKill: number;

  @Column('int')
  pveFriendlyKills: number;

  @Column('int')
  pveKills: number;

  @Column('int')
  pveDeath: number;

  @Column('float')
  pve: string;

  @Column('int')
  playtime: number;

  @Column('int')
  playtimeH: number;

  @Column('int')
  playtimeM: number;

  @Column('character varying', { name: 'favoritPVP', nullable: true })
  favoritPvp: string;

  @Column('character varying', { name: 'favoritPVE', nullable: true })
  favoritPve: string;

  @Column('int')
  pveWins: number;

  @Column('int')
  pvpWins: number;

  @Column('int')
  pveLost: number;

  @Column('int')
  pvpLost: number;

  @Column('int')
  pveAll: number;

  @Column('int')
  pvpAll: number;

  @Column('float')
  pvpwl: number;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

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
