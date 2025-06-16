import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TarefaVisaoGestorModule } from './tarefaVisaoGestor/tarefa.visao.gestor.module';
import { TarefaVisaoColaboradorModule } from './tarefaVisaoColaborador/tarefa.visao.colaborador.module';
import { GestorModule } from './gestor/gestor.module';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { TarefaModule } from './tarefa/tarefa.module';
import { MoedasModule } from './moedas/moedas.module';


@Module({
  imports: [UsuarioModule, GestorModule, ColaboradorModule, TarefaVisaoColaboradorModule, TarefaVisaoGestorModule, TarefaModule, GestorModule, MoedasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
