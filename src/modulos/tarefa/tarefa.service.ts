import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/criar-tarefa.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TarefaService {
    
    constructor(private readonly prisma: PrismaService){}
    async criarTarefa(createTaskDto: CreateTaskDto) {
        const {...taskData} = createTaskDto;

        try{
            const tarefa = await this.prisma.tarefas.create({
            data: {
                titulo: taskData.titulo,
                descricao: taskData.descricao,
                id_colaborador: taskData.id_colaborador,
                data_limite: taskData.data_limite,
                data_atribuicao: taskData.dataAtribuicao,
                quantidade_horas: taskData.quantidadeHoras,
                quantidade_moedas: taskData.quantidadeMoedas

            },
        });
            const tarefa_gestor_colaborador = await this.prisma.tarefa_gestor_colaborador.create({
                data: {
                    id_tarefa: tarefa.id_tarefa,
                    id_gestor: 0,
                    id_colaborador: tarefa.id_colaborador,
                }
            });
            return tarefa;
        }
        catch (error){
            throw new BadRequestException(`Erro ao criar tarefa: ${error.message}`);
        }
    }

    
}