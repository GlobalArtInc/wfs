import { dbConfig } from './db.config';
import redisMicroserviceConfig from './redis-microservice.config';
import commonConfig from './common.config';

export default [dbConfig, commonConfig, redisMicroserviceConfig];
