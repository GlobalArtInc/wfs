import commonConfig from './common.config';
import { dbConfig } from './db.config';
import redisMicroserviceConfig from './redis-microservice.config';
import { redisConfig } from './redis.config';

export default [dbConfig, commonConfig, redisMicroserviceConfig, redisMicroserviceConfig, redisConfig];
