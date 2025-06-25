import { MailerService } from "@nestjs-modules/mailer/dist";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto';

@Injectable()
export class UsuarioService {
    
    constructor(private readonly mailer: MailerService,
        private readonly prisma: PrismaService
    ) {}

    //obs: alterar depois conforme o diagrama de classes
    //atualmente utilizando conforme configuração do curso da HCode
    async enviarEmailRedefinicaoSenha(email: string){
        const user = await this.prisma.user.findFirst({ //preciso do banco de dados de user
            where: {
                email
            }
        });

        if (!user){
            throw new UnauthorizedException("E-mail incorreto. ");
        }

        //ciar assinatura do token (via redis)
        const token = randomBytes(8).toString('hex'); //gera uma string com 16 caracteres

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'mfs53@aluno.ifal.edu.br',
            html: `<p> Olá. Troque sua senha a partir deste token: ${token} </p>`
        })
    }

    //adicionado o parâmetro {id} em relação ao diagrama de classes. Modificar depois
    async redefinirSenha(id: number, token: string){


        const salto = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(this.prisma.user.findFirst(id).senha, salto )

        const usuario = await this.prisma.update({
            where: {
                id,
            },
            data: {
                senhaHash
            }
        });

        return this.criarToken(usuario) //token de acesso à conta;
    }
}