// src/user/user.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users') 
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post() 
  @HttpCode(HttpStatus.CREATED) 
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usuarioService.createUser(createUserDto);
  }
  @Post('login') 
  @HttpCode(HttpStatus.OK) 
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    
    const user = await this.usuarioService.realizarLogin(loginUserDto);
    return { message: 'Login realizado com sucesso', user };
  }
}