import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeTypeOrmOptions } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => makeTypeOrmOptions(),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
