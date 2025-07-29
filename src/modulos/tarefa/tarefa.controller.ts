import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TarefaService } from "./tarefa.service";
import { CreateTaskDto } from "./dto/criar-tarefa.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('tarefas')
export class TarefaController {

    constructor(private readonly tarefaService: TarefaService, 
                private readonly prisma: PrismaService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async criarTarefa(@Body() createTaskDto: CreateTaskDto) {
        const tarefa = await this.tarefaService.criarTarefa(createTaskDto);
        const techLeaders = await this.prisma.gestores.findMany({
        }
        )

        const uniqueTeachLead = techLeaders[Math.floor(Math.random() * techLeaders.length)];

        await this.tarefaService.inserirTarefaGestorColaborador(tarefa, uniqueTeachLead);
        return tarefa;
    }
}