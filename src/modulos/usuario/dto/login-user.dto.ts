// src/user/dto/login-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class LoginUserDto { 
  @IsEmail()
  email: string; 

  @IsNotEmpty()
  @IsString()
  senha: string;
}