import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
const compression = require('compression');
import * as express from 'express';
import * as path from 'node:path';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: isProd
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const rawOrigins =
    process.env.CORS_ORIGINS ||
    (isProd ? '' : 'http://localhost:3009,http://localhost:5173');
  const corsOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (isProd && corsOrigins.length === 0) {
    logger.error(
      'CORS_ORIGINS is required in production (comma-separated list of allowed origins).',
    );
    process.exit(1);
  }

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(compression());

  const jsonLimit = process.env.JSON_LIMIT || '1mb';
  app.use(express.json({ limit: jsonLimit }));
  app.use(express.urlencoded({ extended: true, limit: jsonLimit }));

  if (process.env.TRUST_PROXY === 'true') {
    const http = app.getHttpAdapter().getInstance();
    if (http?.set) http.set('trust proxy', 1);
  }

  const apiPrefix = process.env.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  const serveUploads = process.env.SERVE_UPLOADS !== 'false';
  if (serveUploads) {
    const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
    app.use(
      '/uploads',
      express.static(path.join(process.cwd(), uploadsDir), {
        maxAge: '1y',
        etag: true,
        immutable: true,
      }),
    );
  }

  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  logger.log(
    `Server running at ${url.replace('[::1]', 'localhost')} (env=${process.env.NODE_ENV || 'development'})`,
  );
  logger.log(
    `CORS origins: ${corsOrigins.length ? corsOrigins.join(', ') : 'ALL (dev only)'}`,
  );
}
bootstrap();
