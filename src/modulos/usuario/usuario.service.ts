import { MailerService } from '@nestjs-modules/mailer/dist';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RedisService } from 'src/config/redis';
import { Prisma, usuarios } from '@prisma/client';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly mailer: MailerService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async enviarEmailRedefinicaoSenha(email: string) {
    const user = await this.prisma.usuarios.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('E-mail não encontrado. ');
    }

    //ciar assinatura do token (via redis)
    const token = randomBytes(8).toString('hex'); //gera uma string com 16 caracteres
    const usuario = await this.prisma.usuarios.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const id = usuario?.id_usuario;

    const chave = `reset_senha:${token}:${id}`;
    const valor = id?.toString();

    if (valor) {
      await this.redis.set(chave, valor, 'EX', 1800); //salva o reset de senha no redis por 30 minutos
    }

    try {
      await this.mailer.sendMail({
        from: '"StartiCoins" <noreply@starticoins.com>',
        subject: 'Recuperação de senha',
        to: 'email4@gmail.com',
        html: `<p> Olá. Troque sua senha a partir deste token: ${token} </p>`,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  async redefinirSenha(token: string, novaSenha: string) {
    const chaves = await this.redis.keys(`reset_senha:${token}:*`);

    const id = Number(await this.redis.get(chaves[0])); //alterar

    const salto = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(novaSenha, salto);

    await this.prisma.usuarios.update({
      where: {
        id_usuario: id,
      },
      data: {
        senha: senhaHash,
      },
    });

    return true;
  }

  async createUser(createUserDto: CreateUserDto): Promise<usuarios> {
    //retorna um usuário sem senha
    const { ...userData } = createUserDto;

    const saltRounds = 10;
    const defaultPassword = randomBytes(4).toString('hex'); //gera uma string com 8 caracteres
    console.log('Senha padrão gerada:', defaultPassword);

    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    try {
      const newUser = await this.prisma.usuarios.create({
        data: {
          ...userData,
          cargo: userData.cargo.toString(),
          senha: hashedPassword,
        },
      });

      await this.enviarEmailBoasVindas(
        newUser.email,
        newUser.nome,
        defaultPassword,
      );

      return newUser;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string) || 'unknown field';
          throw new ConflictException(
            `A user with this ${target} already exists.`,
          );
        }
      }
      throw error;
    }
  }

  async realizarLogin(
    loginUserDto: LoginUserDto,
  ): Promise<Omit<usuarios, 'senha'>> {
    const { email, senha } = loginUserDto;

    let foundUser: usuarios | null | undefined;

    if (email) {
      foundUser = await this.prisma.usuarios.findUnique({
        where: {
          email: email,
        },
      });
    }

    if (!foundUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(senha, foundUser.senha);

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }

  private async enviarEmailBoasVindas(
    toEmail: string,
    userName: string,
    defaultPassword: string,
  ) {
    const firstAccessLink = 'http://localhost:3000/primeiro-acesso';

    try {
      await this.mailer.sendMail({
        from: '"StartiCoins" <noreply@starticoins.com>',
        to: toEmail,
        subject: 'Bem-vindo(a) à Plataforma StartiCoins!',
        html: `
                    <p>Olá, ${userName}!</p>
                    <p>Seja bem-vindo(a) à plataforma StartiCoins. Estamos muito felizes em tê-lo(a) conosco!</p>
                    <p>Suas credenciais para o primeiro acesso são:</p>
                    <ul>
                        <li>**Usuário (E-mail):** ${toEmail}</li>
                        <li>**Senha Padrão:** <strong>${defaultPassword}</strong></li>
                    </ul>
                    <p>Para acessar a plataforma e começar a utilizar, clique no link abaixo:</p>
                    <p><a href="${firstAccessLink}">Acessar Plataforma StartiCoins</a></p>
                    <p>Por favor, altere sua senha após o primeiro login para garantir a segurança da sua conta.</p>
                    <p>Atenciosamente,</p>
                    <p>Equipe StartiCoins</p>
                `,
      });

      console.log('E-mail de boas-vindas enviado para:', toEmail);
    } catch (error) {
      console.error(
        'Erro ao enviar e-mail de boas-vindas para',
        toEmail,
        ':',
        error,
      );
    }
  }
}
