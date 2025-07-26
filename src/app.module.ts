import { Module } from '@nestjs/common';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { TarefaModule } from './modulos/tarefa/tarefa.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsuarioModule,
    TarefaModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'corrine.reinger@ethereal.email',
          pass: 'D3RVJNDJBXEad4ZZPg',
        },
        secure: false,
      },
      defaults: {
        from: '"TestEmails" <email4@gmail.com>',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
