import { registerAs } from '@nestjs/config';
import { MIGRATIONS } from 'migrations';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DAL_ENTITIES as entities } from '@app/dal/repositories';

export const databaseCredentials = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
export const defaultDatabaseConfig = {
  type: 'postgres',
  logging: ['error'],
  synchronize: false,
  schema: 'public',
  entities,
  migrations: [...MIGRATIONS],
  migrationsTableName: 'migration',
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const dbConfig = registerAs('db', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
