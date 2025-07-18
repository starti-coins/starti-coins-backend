<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";

@Module({
    imports: [],
    controllers: [UsuarioController],
    providers: [UsuarioService]
})
export class UsuarioModule {}
=======
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
>>>>>>> 86e688c7af3c13e01292931075d6e079fb68fed2
