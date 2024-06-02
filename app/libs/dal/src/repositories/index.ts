import { AchievementEntity, AchievementRepository } from './achievement';
import { ClanEntity, ClanMemberEntity, ClanRepository } from './clan';
import { EventsEntity, EventsRepository } from './events';
import { GuildEntity, GuildRepository } from './guild';
import {
  PlayerEntity,
  PlayerAchievementEntity,
  PlayerStatEntity,
  PlayerRepository,
  PlayerStatRepository,
} from './player';
import { ServerEntity, ServerRepository } from './server';
import { SettingEntity, SettingRepository } from './setting';
import { UserEntity, UserPlayerEntity, UserClanEntity, UserRepository } from './user';
import { VipEntity, VipRepository, VipTypeEntity } from './vip';
import { WeaponEntity, WeaponCategoryEntity, WeaponRepository } from './weapon';

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
  ServerRepository,
  UserRepository,
  VipRepository,
  WeaponRepository,
  SettingRepository,
];
