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
                //faltando data limite e projetos
                ...taskData
            }
            })
            return tarefa;
        }
        catch (error){
            throw new BadRequestException(`Erro ao criar tarefa: ${error.message}`);
        }
    }
}