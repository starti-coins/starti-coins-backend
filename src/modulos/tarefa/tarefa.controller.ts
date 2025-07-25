import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TarefaService } from "./tarefa.service";
import { CreateTaskDto } from "./dto/criar-tarefa.dto";

@Controller('tarefas')
export class TarefaController {

    constructor(private readonly tarefaService: TarefaService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async criarTarefa(@Body() createTaskDto: CreateTaskDto) {
        return this.tarefaService.criarTarefa(createTaskDto);
    }
}