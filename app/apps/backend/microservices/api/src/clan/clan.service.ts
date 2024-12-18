import { ClanEntity, ClanRepository } from '@app/dal/repositories/clan';
import { WarfaceApiClan } from '@app/infrastructure/apis/warface/warface-api.types';
import { WarfaceApiService } from '@app/infrastructure/apis/warface/warface.api.service';
import { REDIS_PROVIDER } from '@app/shared/configs/redis-microservice.config';
import { CLAN_SAVE_REDIS_COMMAND } from '@app/shared/constants';
import { HelpersService } from '@app/shared/modules/helpers/helpers.service';
import { RedisCacheService } from '@app/shared/modules/redis-microservice/redis.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as moment from 'moment';
import { ILike } from 'typeorm';

@Injectable()
export class ClanService {
  private readonly servers = ['ru', 'int'];

  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redisProxy: ClientProxy,
    private readonly clanRepository: ClanRepository,
    private readonly warfaceApiService: WarfaceApiService,
    private readonly redisService: RedisCacheService,
    private readonly helpersService: HelpersService,
  ) {}

  async getByName(name: string) {
    const clan = await this.clanRepository.getOneBy({ name: ILike(name) }, { relations: ['members'] });
    if (clan) {
      const cachedClan = await this.redisService.get<ClanEntity>(clan.clanId);

      return cachedClan ? this.formatClanResponse(cachedClan) : this.updateClanFromApi(name);
    }
    return this.updateClanFromApi(name);
  }

  private formatClanResponse(clan: Partial<ClanEntity>) {
    return [
      {
        server: clan.server,
        state: {
          createdAt: clan.createdAt,
          updatedAt: clan.updatedAt,
        },
        data: {
          id: clan.id,
          name: clan.name,
          members: clan.members,
        },
      },
    ];
  }

  private async updateClanFromApi(name: string) {
    for (const server of this.servers) {
      const apiClan = await this.warfaceApiService.getClan(server, name);

      if (apiClan.id) {
        return this.saveAndCacheClan(apiClan, server, name);
      }
    }
    throw new NotFoundException({ code: 'clan_not_found', name, message: `Клан «${name}» не найден.` });
  }

  private async saveAndCacheClan(apiClan: WarfaceApiClan, server: string, name: string) {
    const clanEntity = await this.clanRepository.getOneBy({ name: ILike(name), server });
    const clanId = clanEntity?.clanId || this.helpersService.generateUUID();
    const formattedClan = this.formatClanResponse({
      server,
      createdAt: clanEntity?.createdAt || moment().toDate(),
      updatedAt: moment().toDate(),
      id: apiClan.id,
      members: apiClan.members,
      name: apiClan.name,
    });

    this.redisProxy.emit(CLAN_SAVE_REDIS_COMMAND, { apiClan, clanEntity: { clanId, ...clanEntity }, server });
    await this.redisService.set(
      clanId,
      {
        server,
        createdAt: clanEntity?.createdAt || moment().toDate(),
        updatedAt: moment().toDate(),
        ...apiClan,
      },
      120,
    );

    return formattedClan;
  }
}
