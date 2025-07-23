import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
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

  @Post('reset-senha')
  @HttpCode(HttpStatus.OK)
  async perdirResetSenhaEmail(@Query('email') email: string) {
    return this.usuarioService.enviarEmailRedefinicaoSenha(email);
  }

  @Put('reset-senha/:token')
  @HttpCode(HttpStatus.OK)
  async atualizarSenhaViaResetSenha(@Param() token: string, novaSenha: string) {
    return this.usuarioService.redefinirSenha(token, novaSenha);
  }
}
