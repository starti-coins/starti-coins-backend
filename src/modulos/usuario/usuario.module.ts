import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service'; 
import { UsuarioController } from './usuario.controller'; 
import { PrismaModule } from 'src/prisma/prisma.module'; 
import { MailerModule } from '@nestjs-modules/mailer'; 



@Module({
  imports: [
    PrismaModule,
    MailerModule,  
  ],
  controllers: [UsuarioController], 
  providers: [UsuarioService],     
  exports: [UsuarioService],       
})
export class UsuarioModule {} 