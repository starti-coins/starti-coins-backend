// src/user/dto/create-user.dto.ts
import { IsString, IsEmail, IsInt, Min, IsEnum, IsNotEmpty, Max, IsBoolean } from 'class-validator';

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
  @IsString()
  matricula: string;

  @IsNotEmpty()
  @IsString() 
  cpf: string;

  @IsNotEmpty()
  @IsString() 
  rg: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(Cargo)
  cargo: Cargo;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1)
  periodo: number;

  @IsBoolean()
  status: boolean
}