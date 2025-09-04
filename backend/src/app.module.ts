import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';

const enableStatic = (process.env.SERVE_UPLOADS ?? 'false') !== 'false';
const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
const throttleTtlSec = Math.max(1, Number(process.env.THROTTLE_TTL || '60'));
const throttleLimit = Math.max(1, Number(process.env.THROTTLE_LIMIT || '60'));

@Module({
  imports: [
    ...(enableStatic
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), uploadsDir),
            serveRoot: '/uploads',
          }),
        ]
      : []),

    ThrottlerModule.forRoot([
      {
        ttl: seconds(throttleTtlSec),
        limit: throttleLimit,
      },
    ]),

    DatabaseModule,
    AuthModule,
    PostModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
