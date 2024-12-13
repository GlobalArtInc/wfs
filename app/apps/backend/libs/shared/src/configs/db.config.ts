import { DAL_ENTITIES as entities } from '@app/dal/repositories';
import { registerAs } from '@nestjs/config';
import { MIGRATIONS } from 'migrations';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const databaseCredentials: PostgresConnectionCredentialsOptions = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
export const defaultDatabaseConfig: PostgresConnectionOptions = {
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

export const dbConfig = registerAs('database', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
