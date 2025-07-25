export class CreateTaskDto{

    titulo: string;
    descricao: string;
    id_colaborador: number;
    dataAtribuicao: Date;
    data_limite: Date;
    quantidadeHoras: number;
    quantidadeMoedas: number;
}
