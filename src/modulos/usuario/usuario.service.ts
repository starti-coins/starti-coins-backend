import { MailerService } from "@nestjs-modules/mailer/dist";
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RedisService } from "src/config/redis";

@Injectable()
export class UsuarioService {
    
    constructor(
        private readonly mailer: MailerService,
        private prisma: PrismaService,
        private readonly redis: RedisService
    ) {}

    //obs: alterar depois conforme o diagrama de classes
    //atualmente utilizando conforme configuração do curso da HCode
    async enviarEmailRedefinicaoSenha(email: string){
        
        const user = await this.prisma.usuarios.findUnique({
            where: {
                email
            }
        });

        if (!user){
            throw new NotFoundException("E-mail não encontrado. ");
        }

        //ciar assinatura do token (via redis)
        const token = randomBytes(8).toString('hex'); //gera uma string com 16 caracteres
        const usuario = await this.prisma.usuarios.findUnique({
            where: {
                email: email,
            }
        })

        const id = usuario?.id_usuario;

        const chave = `reset_senha:${token}:${id}`;
        const valor = id?.toString();

        if (valor){
            await this.redis.set(chave, valor, 'EX', 1800); //salva o reset de senha no redis por 30 minutos
        }
        

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'mfs53@aluno.ifal.edu.br',
            html: `<p> Olá. Troque sua senha a partir deste token: ${token} </p>`
        })
    }

    //adicionado o parâmetro {id} em relação ao diagrama de classes. Modificar depois
    async redefinirSenha(token: string, novaSenha: string){
        const chaves = this.redis.keys(`reset_senha:${token}:*`);

        const id = Number(this.redis.get(chaves[0])); //alterar

        const salto = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(novaSenha, salto );

        const usuario = await this.prisma.usuarios.update({
            where: {
                id_usuario: id,
            },
            data: {
                senha: senhaHash
            }
        });

        return true;
    }



  async createUser(createUserDto: CreateUserDto) {
    const { senha, ...userData } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    try {
      const newUser = await this.prisma.usuarios.create({
        data: {
          ...userData, 
          senha: hashedPassword, 
        },
      });

      const { senha: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;

    } catch (error) {
      if (error.code === 'P2002') {
        const target = (error.meta as any)?.target || 'unknown field';
        throw new ConflictException(`A user with this ${target} already exists.`);
      }
      throw error; 
    }
  }
    async realizarLogin(loginUserDto: LoginUserDto): Promise<Omit<User, 'senha'>> {
        const { email, matricula, senha } = loginUserDto;

        const MOCKED_USERS = [
        {
            id: 1,
            nome: "Gestor Teste",
            matricula: 12345,
            periodo_atual: 8,
            carga: "Integral",
            cpf: "111.222.333-44",
            rg: "12.345.678-9",
            endereco: "Rua do Gestor, 100",
            email: "gestor@example.com",
            senha: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890", 
            role: UserRole.GESTOR, //prismaClient
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            nome: "Colaborador Teste",
            matricula: 54321,
            periodo_atual: 4,
            carga: "Parcial",
            cpf: "999.888.777-66",
            rg: "98.765.432-1",
            endereco: "Rua do Colaborador, 200",
            email: "colaborador@example.com",
            senha: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
            role: UserRole.COLABORADOR, //prismaClient
            createdAt: new Date(),
            updatedAt: new Date()
        },
        ];

        let foundUser: User | undefined; //prisma client

        if (email) {
        foundUser = MOCKED_USERS.find(user => user.email === email);
        } else if (matricula) {
        foundUser = MOCKED_USERS.find(user => user.matricula === matricula);
        }

        if (!foundUser) {
        throw new NotFoundException('Usuário não encontrado.');
        }

        const isPasswordValid = await bcrypt.compare(senha, foundUser.senha);

        if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas.');
        }

        const { senha: _, ...userWithoutPassword } = foundUser;
        return userWithoutPassword;
    }
}