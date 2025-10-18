import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const makeTypeOrmOptions = (): DataSourceOptions => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'psychology',

    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],

    synchronize: true,
    logging: process.env.DB_LOGGING === 'true',

    namingStrategy: new SnakeNamingStrategy(),
    ssl: false,
  };
};
