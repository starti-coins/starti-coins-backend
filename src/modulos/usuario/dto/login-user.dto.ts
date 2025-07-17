import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class LoginUserDto {
  @IsOptional() 
  @IsEmail()
  email?: string; 

  @IsOptional() 
  @IsInt()
  @IsNotEmpty() 
  matricula?: number;

  @IsNotEmpty()
  @IsString()
  senha: string;
}