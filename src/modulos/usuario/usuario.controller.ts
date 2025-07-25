import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('usuarios')
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

  @Post('reset-senha/:email')
  @HttpCode(HttpStatus.OK)
  async perdirResetSenhaEmail(@Param('email') email: string) {
    return this.usuarioService.enviarEmailRedefinicaoSenha(email);
  }

  @Patch('reset-senha/:token')
  @HttpCode(HttpStatus.OK)
  async atualizarSenhaViaResetSenha(
    @Param('token') token: string,
    @Body('senha') novaSenha: string,
  ) {
    return this.usuarioService.redefinirSenha(token, novaSenha);
  }
}
