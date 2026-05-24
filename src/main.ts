import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { BusinessErrorFilter } from './infrastructure/external-service/audit/business-error.filter';
import { AuditInterceptor } from './infrastructure/external-service/audit/audit.interceptor';
import { AuditClient } from './infrastructure/external-service/audit/audit.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const metricsRegistry = new Registry();
  collectDefaultMetrics({ register: metricsRegistry, prefix: 'branch_service_' });
  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.get('/api/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', metricsRegistry.contentType);
    res.send(await metricsRegistry.metrics());
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new BusinessErrorFilter());
  app.useGlobalInterceptors(new AuditInterceptor(new AuditClient()));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Branch Service API')
    .setDescription('API MeubleZone — filiales (branches) et employés du groupe')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  // 🔥 récupération d'un service Nest
  const prisma = app.get(PrismaService);

  // fermeture propre de Prisma
  await prisma.enableShutdownHooks(app);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}/api`);
  console.log(`📘 Swagger UI: http://localhost:${port}/api/docs`);
}

bootstrap();