import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsuarioModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
