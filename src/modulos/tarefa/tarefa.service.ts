import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/criar-tarefa.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { gestores, tarefas } from "@prisma/client";

@Injectable()
export class TarefaService {
    
    constructor(private readonly prisma: PrismaService){}
    async criarTarefa(createTaskDto: CreateTaskDto) {
        const {...taskData} = createTaskDto;

        try{
            const colaborador = await this.prisma.colaboradores.findUnique({
                where: {
                    id_colaborador: taskData.id_colaborador
                }
            });

            if (!colaborador) {
                throw new NotFoundException(`Colaborador com ID ${taskData.id_colaborador} não encontrado.`);
            }

            const quantidadeHorasCalculada = await this.calcularQuantidadeHoras(taskData.dataAtribuicao, taskData.data_limite) * 2;
            console.log('Quantidade de horas calculada: ', quantidadeHorasCalculada);

            const tarefa = await this.prisma.tarefas.create({
            data: {
                titulo: taskData.titulo,
                descricao: taskData.descricao,
                id_colaborador: taskData.id_colaborador,
                data_atribuicao: taskData.dataAtribuicao,
                data_limite: taskData.data_limite,
                quantidade_horas: quantidadeHorasCalculada,
                quantidade_moedas: quantidadeHorasCalculada * 10
            },
        });
            return tarefa;
        }
        catch (error){
            throw new BadRequestException(`Erro ao criar tarefa: ${error.message}`);
        }
    }

    async inserirTarefaGestorColaborador(tarefa: tarefas, techLead: gestores){
        if (tarefa.id_colaborador != null && techLead.id_gestor != null) {
            const tarefaGestorColaborador = await this.prisma.tarefa_gestor_colaborador.create({
            data: {
                id_colaborador: tarefa.id_colaborador,
                id_gestor: techLead.id_gestor,
                id_tarefa: tarefa.id_tarefa,
            }
        });
        }
    }

    private async calcularQuantidadeHoras(dataAtribuicao: Date, data_limite: Date) {
        const umDiaEmMs = 24 * 60 * 60 * 1000;
        const dataLimiteTime = new Date(data_limite).getTime();
        const dataAtribuicaoTime = new Date(dataAtribuicao).getTime();
        const diferencaDatasEmMs = Math.abs(dataLimiteTime - dataAtribuicaoTime);
        return Math.floor(diferencaDatasEmMs / umDiaEmMs);
    }

    
}
