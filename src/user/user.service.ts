// src/user/user.service.ts
import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { senha, ...userData } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    try {
      const newUser = await this.prisma.user.create({
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
        role: UserRole.GESTOR,
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
        role: UserRole.COLABORADOR,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    let foundUser: User | undefined;

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