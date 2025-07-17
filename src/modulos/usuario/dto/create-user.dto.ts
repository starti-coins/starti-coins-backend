import { IsString, IsEmail, IsInt, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/user-role.enum'; 

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  matricula: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  periodo_atual: number;

  @IsNotEmpty()
  @IsString()
  carga: string;

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

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole; 
}