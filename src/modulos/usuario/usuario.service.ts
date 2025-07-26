import { MailerService } from '@nestjs-modules/mailer/dist';
import {
  BadRequestException,
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
import { UpdateUserDto } from './dto/update-user.dto';
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

    console.log('id: ', id);
    console.log('chave: ', chave);
    console.log('valor: ', valor);

    if (valor) {
      await this.redis.set(chave, valor, 'EX', 300); //salva o reset de senha no redis por 5 minutos
    }

    try {
      await this.mailer.sendMail({
        from: '"StartiCoins" <noreply@starticoins.com>',
        subject: 'Recuperação de senha',
        to: user.email,
        html: `<p> Olá. Troque sua senha a partir deste token: ${token} </p>`,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  async redefinirSenha(token: string, novaSenha: string) {
    try{
      const chaves = await this.redis.keys(`reset_senha:${token}:*`);

      const id = Number(await this.redis.get(chaves[0]));

      const quantidadeSaltos = 10;
      const senhaHash = await bcrypt.hash(novaSenha, quantidadeSaltos);

      
        await this.prisma.usuarios.update({
        where: {
          id_usuario: id,
        },
        data: {
          senha: senhaHash,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      throw new BadRequestException('Token inválido ou expirado.');
    }

    //this.redis.del(`reset_senha:${token}:${id}`);

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

      if (newUser.cargo == 'COLABORADOR') {
        await this.prisma.colaboradores.create({
          data: {
            id_usuario: newUser.id_usuario,
          }
        });
      } else if (newUser.cargo == 'TECH_LEAD') {
        await this.prisma.gestores.create({
          data: {
            id_usuario: newUser.id_usuario,
          }
        });
      }

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

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<usuarios, 'senha'>> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Verificar se email, CPF ou matrícula já existem (se estão sendo alterados)
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.usuarios.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('E-mail já está em uso.');
      }
    }

    if (updateUserDto.cpf && updateUserDto.cpf !== existingUser.cpf) {
      const cpfExists = await this.prisma.usuarios.findUnique({
        where: { cpf: updateUserDto.cpf },
      });
      if (cpfExists) {
        throw new ConflictException('CPF já está em uso.');
      }
    }

    if (
      updateUserDto.matricula &&
      updateUserDto.matricula !== existingUser.matricula
    ) {
      const matriculaExists = await this.prisma.usuarios.findUnique({
        where: { matricula: updateUserDto.matricula },
      });
      if (matriculaExists) {
        throw new ConflictException('Matrícula já está em uso.');
      }
    }

    // Atualizar o usuário
    const updatedUser = await this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: {
        ...updateUserDto,
        cargo: updateUserDto.cargo?.toString(),
      },
    });

    // Retornar usuário sem a senha
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...userWithoutPassword } = updatedUser;
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
