// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsInt, Min, IsEnum, IsNotEmpty, Max } from 'class-validator';

enum Cargo {
  TECH_LEAD,
  GESTOR_RH,
  COLABORADOR
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsInt()
  matricula: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1)
  periodo_atual: number;

  @IsNotEmpty()
  @IsEnum(Cargo)
  cargo: Cargo;

  @IsNotEmpty()
  @IsString() 
  cpf: string;

  @IsNotEmpty()
  @IsString() 
  rg: string;

  @IsNotEmpty()
  @IsString()
  endereco: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}