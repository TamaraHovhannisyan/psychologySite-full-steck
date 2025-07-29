import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'hayi_blog',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
  logging: true,
};
