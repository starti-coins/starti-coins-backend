import { Module } from '@nestjs/common';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsuarioModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'augusta97@ethereal.email',
            pass: 'AU8cVmCXBaNxpbP5NF'
        }
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      /*template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },*/
    }),  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
