import { MailerService } from "@nestjs-modules/mailer"; 
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RedisService } from "src/config/redis";
import { User, UserRole } from '@prisma/client'; 


@Injectable()
export class UsuarioService {
    
    constructor(
        private readonly mailer: MailerService,
        private readonly prisma: PrismaService,
        private readonly redis: RedisService
    ) {}

    //obs: alterar depois conforme o diagrama de classes
    //atualmente utilizando conforme configuração do curso da HCode
    async enviarEmailRedefinicaoSenha(email: string){
        const user = await this.prisma.user.findFirst({ 
            where: {
                email
            }
        });

        if (!user){
            throw new UnauthorizedException("E-mail incorreto. ");
        }

        // criar assinatura do token (via redis)
        const token = randomBytes(8).toString('hex'); // gera uma string com 16 caracteres
        const userId = user.id; 

        const chave = `reset_senha:${token}:${userId}`;
        const valor = userId.toString(); 

        await this.redis.set(chave, valor, 'EX', 1800); 

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: email, // Destinatário deve ser o e-mail do usuário
            html: `<p> Olá. Troque sua senha a partir deste token: ${token} </p>`
        })
    }

    //adicionado o parâmetro {id} em relação ao diagrama de classes. Modificar depois
    async redefinirSenha(token: string, novaSenha: string){
        const chaves = await this.redis.keys(`reset_senha:${token}:*`); 

        if (chaves.length === 0) {
            throw new UnauthorizedException("Token de redefinição de senha inválido ou expirado.");
        }

        const idString = await this.redis.get(chaves[0]);
        if (!idString) {
            throw new UnauthorizedException("Token de redefinição de senha inválido ou expirado.");
        }
        const userIdToUpdate = parseInt(idString, 10); 

        const salto = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(novaSenha, salto );

        const usuario = await this.prisma.user.update({ 
            where: {
                id: userIdToUpdate,
            },
            data: {
                senha: senhaHash 
            }
        });

        await this.redis.del(chaves[0]);

        return true;
    }


    async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'senha'>> {
        const { senha, ...userData } = createUserDto;

        const saltRounds = 10;
        const defaultPassword = 'password@123'; // Senha padrão para o primeiro acesso
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    ...userData, 
                    senha: hashedPassword, 
                },
            });

            const { senha: _, ...userWithoutPassword } = newUser;
            
            await this.sendWelcomeEmail(newUser.email, newUser.nome, defaultPassword);
            
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

    private async sendWelcomeEmail(toEmail: string, userName: string, defaultPassword: string) {
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
                    <p>A Equipe StartiCoins</p>
                `,
            });

            console.log('E-mail de boas-vindas enviado para:', toEmail);

        } catch (error) {
            console.error('Erro ao enviar e-mail de boas-vindas para', toEmail, ':', error);
        }
    }
}