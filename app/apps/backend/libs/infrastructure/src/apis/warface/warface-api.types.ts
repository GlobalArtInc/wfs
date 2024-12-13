import { PlayerEntity } from '@app/dal/repositories/player';
import { PlayerTypeEnum } from './warface-api.enums';

export interface WarfaceApiClanDataState {
  createdAt: Date;
  updatedAt: Date;
}

export enum WarfaceApiClanRole {
  Master = 'MASTER',
  Officer = 'OFFICER',
  Regular = 'REGULAR',
}

export interface WarfaceApiClanMember {
  nickname: string;
  rank_id: string;
  clan_points: string;
  clan_role: WarfaceApiClanRole;
}

export interface WarfaceApiClan {
  id: number;
  name: string;
  members: any;
}

export interface WarfaceApiClanData {
  server: string;
  state: WarfaceApiClanDataState;
  data: WarfaceApiClan;
}

export interface PlayerDataState {
  type: PlayerTypeEnum;
  updatedAt: string;
}

export interface WarfaceApiAchievement {
  achievement_id: string;
  progress: number;
  completion_time: string;
}

export interface WarfaceApiSavePlayerData {
  playerId: string;
  server: string;
  player: PlayerEntity;
  fullPlayer: Record<string, number>;
  achievements: WarfaceApiAchievement[];
}

export interface WarfaceApiPlayerData {
  server: string;
  state: Record<string, unknown>;
  player: Partial<PlayerEntity>;
  fullPlayer: Record<string, unknown>;
  achievements: any[];
}

export interface WarfaceApiSavePlayerData {
  playerId: string;
}
