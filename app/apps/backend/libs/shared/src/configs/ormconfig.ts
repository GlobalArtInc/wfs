import { DataSource } from 'typeorm';
import { databaseCredentials, defaultDatabaseConfig } from './db.config';

const connectDB = new DataSource({ ...defaultDatabaseConfig, ...databaseCredentials });

connectDB
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized');
  })
  .catch((err) => {
    console.error('Data Source initialization error', err);
  });

export default connectDB;
