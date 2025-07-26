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
                data_limite: taskData.data_limite,
                data_atribuicao: taskData.dataAtribuicao,
                quantidade_horas: taskData.quantidadeHoras,
                quantidade_moedas: taskData.quantidadeMoedas
            },
        });
            return tarefa;
        }
        catch (error){
            throw new BadRequestException(`Erro ao criar tarefa: ${error.message}`);
        }
    }

    
}