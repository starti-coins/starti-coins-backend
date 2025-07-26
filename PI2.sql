create table usuarios(
	id_usuario serial primary key,
    nome VARCHAR(200) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    rg VARCHAR(20),
    email VARCHAR(126) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
	cargo varchar (126) not null check (cargo in('gestor_rh', 'tech_lead', 'colaborador')),
	periodo integer default 1,
	status boolean default true --ativo/inativo
);

CREATE TABLE COLABORADORES (
    id_colaborador serial primary key,
    id_usuario INT NOT NULL,

    FOREIGN KEY(id_usuario) references usuarios(id_usuario)
);

CREATE TABLE GESTORES (
    id_gestor serial primary key,
    id_usuario INT NOT NULL,

    FOREIGN KEY(id_usuario) references usuarios(id_usuario)
);

CREATE TABLE tarefas (
	id_tarefa SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_limite DATE NOT NULL,
    data_atribuicao DATE DEFAULT CURRENT_DATE,
    data_envio DATE,
	quantidade_horas INTEGER DEFAULT 0,
    quantidade_moedas INTEGER DEFAULT 0,
	status_tarefa boolean default false, -- concluída ou não

	FOREIGN KEY (id_projeto) REFERENCES projetos(id_projeto)
);

CREATE TABLE tarefa_gestor_colaborador (
    id_tarefa_gestor_colaborador serial primary key,
    id_colaborador INT NOT NULL,
    id_gestor INT NOT NULL,
    id_tarefa INT NOT NULL,
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador),
    FOREIGN KEY (id_gestor) REFERENCES gestores(id_gestor),
    FOREIGN KEY (id_tarefa) REFERENCES tarefas(id_tarefa)
);

CREATE TABLE justificativas (
    id_justificativa SERIAL PRIMARY KEY,
    texto TEXT default 'sem justificativa',
    data_justificativa DATE DEFAULT CURRENT_DATE,
    id_tarefa INT UNIQUE NOT NULL,
    FOREIGN KEY (id_tarefa) REFERENCES tarefas(id_tarefa)
);

