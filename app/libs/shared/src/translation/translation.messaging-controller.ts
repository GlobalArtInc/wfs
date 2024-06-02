import { Controller, Inject, UseFilters, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, EventPattern, Payload, Transport } from '@nestjs/microservices';
import { ApiExcludeController } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

import {
  ClearCacheEventDto,
  CreateTranslateEventDto,
  UpdateTranslateEventDto,
  UpsertLocalTranslateEventDto,
} from './dtos';
import { RELOAD_CACHE_FROM_REMOTE_EVENT, UPDATE_LOCAL_TRANSLATE_EVENT } from './constants';
import { BadRequestExceptionFilter } from '../filters/rpc-bad-request-exception.filter';
import { MessageBrokerTopicEnum } from '../enums/message-broker-topic.enum';
import { REDIS_PROVIDER } from '../configs/redis-microservice.config';
import { TranslatorService } from '../modules/class-translator/translation.service';

@Controller()
@ApiExcludeController()
export class TranslationMessagingController {
  constructor(
    @Inject(TranslatorService) private readonly translatorService: TranslatorService,
    @Inject(REDIS_PROVIDER)
    private readonly redisClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @UseFilters(new BadRequestExceptionFilter())
  @EventPattern(MessageBrokerTopicEnum.TRANSLATION_EVENTS, Transport.KAFKA)
  async handleCreateKey(@Payload(new ValidationPipe()) message: CreateTranslateEventDto) {
    if (message.data.projectId === this.configService.getOrThrow('common.translatorProjectId')) {
      await Promise.all(
        message.data.values.map((value) => {
          return lastValueFrom(
            this.redisClient.emit<void, UpsertLocalTranslateEventDto>(UPDATE_LOCAL_TRANSLATE_EVENT, {
              key: message.data.keyName,
              lang: value.langName,
              value: value.value,
            }),
          );
        }),
      );
    }
  }

  @UseFilters(new BadRequestExceptionFilter())
  @EventPattern(MessageBrokerTopicEnum.TRANSLATION_EVENTS, Transport.KAFKA)
  async handleUpdateKey(@Payload(new ValidationPipe()) message: UpdateTranslateEventDto) {
    if (message.data.projectId === this.configService.getOrThrow('common.translatorProjectId')) {
      await lastValueFrom(
        this.redisClient.emit<void, UpsertLocalTranslateEventDto>(UPDATE_LOCAL_TRANSLATE_EVENT, {
          key: message.data.keyName,
          lang: message.data.langName,
          value: message.data.keyValue,
        }),
      );
    }
  }

  @UseFilters(new BadRequestExceptionFilter())
  @EventPattern(MessageBrokerTopicEnum.TRANSLATION_EVENTS, Transport.KAFKA)
  async clearCache(@Payload(new ValidationPipe()) _message: ClearCacheEventDto) {
    await lastValueFrom(this.redisClient.emit(RELOAD_CACHE_FROM_REMOTE_EVENT, {}));
  }

  @EventPattern(RELOAD_CACHE_FROM_REMOTE_EVENT, Transport.REDIS)
  async reloadLocalCache() {
    await this.translatorService.upsertFromRemote();
  }

  @EventPattern(UPDATE_LOCAL_TRANSLATE_EVENT, Transport.REDIS)
  async updateLocalKey(data: UpsertLocalTranslateEventDto) {
    await this.translatorService.updateKey(data.key, data.value, data.lang);
  }
}
