// src/user/user.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() 
  @HttpCode(HttpStatus.CREATED) 
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post('login') 
  @HttpCode(HttpStatus.OK) 
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    
    const user = await this.userService.realizarLogin(loginUserDto);
    return { message: 'Login realizado com sucesso', user };
  }
}