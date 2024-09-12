import { RedisMicroserviceModule } from "@app/shared/modules/redis-microservice/redis-microservice.module";
import { SharedModule } from "@app/shared/modules/shared.module";
import { Module } from "@nestjs/common";
import { ClanMessagingController } from "./controllers/clan.messaging-controller";
import { ClanService } from "./clan.service";

@Module({
  imports: [SharedModule, RedisMicroserviceModule],
  controllers: [ClanMessagingController],
  providers: [ClanService],
})
export class ClanModule {

}