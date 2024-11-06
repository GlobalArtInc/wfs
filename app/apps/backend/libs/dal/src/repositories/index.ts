import { AchievementEntity, AchievementRepository } from './achievement';
import { ClanEntity, ClanMemberEntity, ClanRepository } from './clan';
import { EventsEntity, EventsRepository } from './events';
import { GuildEntity, GuildRepository } from './guild';
import {
    PlayerAchievementEntity,
    PlayerEntity,
    PlayerRepository,
    PlayerStatEntity,
    PlayerStatRepository,
} from './player';
import { PlayerAchievementRepository } from './player/player-achievement.repository';
import { ServerEntity, ServerRepository } from './server';
import { SettingEntity, SettingRepository } from './setting';
import { UserClanEntity, UserEntity, UserPlayerEntity, UserRepository } from './user';
import { VipEntity, VipRepository, VipTypeEntity } from './vip';
import { WeaponCategoryEntity, WeaponEntity, WeaponRepository } from './weapon';

export const DAL_ENTITIES = [
  AchievementEntity,
  ClanEntity,
  ClanMemberEntity,
  EventsEntity,
  GuildEntity,
  PlayerEntity,
  PlayerAchievementEntity,
  PlayerStatEntity,
  ServerEntity,
  UserEntity,
  UserPlayerEntity,
  UserClanEntity,
  VipEntity,
  VipTypeEntity,
  WeaponEntity,
  WeaponCategoryEntity,
  SettingEntity,
];

export const DAL_REPOSITORIES = [
  AchievementRepository,
  ClanRepository,
  EventsRepository,
  GuildRepository,
  PlayerRepository,
  PlayerStatRepository,
  PlayerAchievementRepository,
  ServerRepository,
  UserRepository,
  VipRepository,
  WeaponRepository,
  SettingRepository,
];
