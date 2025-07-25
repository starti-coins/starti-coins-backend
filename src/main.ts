import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.get(PrismaService);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);

  /*const redis = new Redis(6379,'localhost'); // Default port is 6379

    redis.set("reset_teste", "teste");
    redis.get("reset_teste", (err, result) => {
      // `result` should be "bar"
      console.log(err, result);
    });*/
}

void bootstrap();
