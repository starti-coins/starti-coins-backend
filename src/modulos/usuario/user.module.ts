import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from '../../prisma/prisma.service'; 
import { RedisService } from 'src/config/redis';

@Module({
  imports: [], 
  controllers: [UsuarioController], 
  providers: [UsuarioService, PrismaService, RedisService], 
  exports: [UsuarioService], 
})
export class UsuarioModule {}