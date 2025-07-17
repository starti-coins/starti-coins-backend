import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from './prisma/prisma.service'; 

async function bootstrap() {
  const redis = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const prismaService = app.get(PrismaService);

  app.enableShutdownHooks();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'kaihfd6xsyatztpv@ethereal.email',
      pass: 'snGAeRZYHuzzqjqxea',
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.error('Erro ao verificar transporter de e-mail:', error);
    } else {
      console.log('Servidor de e-mail Ethereal pronto para enviar mensagens.');
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();