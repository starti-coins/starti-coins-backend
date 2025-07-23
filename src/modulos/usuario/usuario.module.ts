import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service'; 
import { UsuarioController } from './usuario.controller'; 
import { PrismaModule } from 'src/prisma/prisma.module'; 
import { MailerModule } from '@nestjs-modules/mailer'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/config/redis';



@Module({
  imports: [
    PrismaModule,
    MailerModule,  
  ],
  controllers: [UsuarioController], 
  providers: [UsuarioService, PrismaService, RedisService],     
  exports: [UsuarioService],       
})
export class UsuarioModule {} 
