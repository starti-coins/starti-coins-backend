-- CreateTable
CREATE TABLE "colaboradores" (
    "id_colaborador" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "colaboradores_pkey" PRIMARY KEY ("id_colaborador")
);

-- CreateTable
CREATE TABLE "gestores" (
    "id_gestor" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "gestores_pkey" PRIMARY KEY ("id_gestor")
);

-- CreateTable
CREATE TABLE "justificativas" (
    "id_justificativa" SERIAL NOT NULL,
    "texto" TEXT DEFAULT 'sem justificativa',
    "data_justificativa" DATE DEFAULT CURRENT_DATE,
    "id_tarefa" INTEGER NOT NULL,

    CONSTRAINT "justificativas_pkey" PRIMARY KEY ("id_justificativa")
);

-- CreateTable
CREATE TABLE "tarefa_gestor_colaborador" (
    "id_colaborador" INTEGER NOT NULL,
    "id_gestor" INTEGER NOT NULL,
    "id_tarefa" INTEGER NOT NULL,
    "id_tarefa_gestor_colaborador" SERIAL NOT NULL,

    CONSTRAINT "tarefa_gestor_colaborador_pkey" PRIMARY KEY ("id_tarefa_gestor_colaborador")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id_tarefa" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "data_limite" DATE NOT NULL,
    "data_atribuicao" DATE DEFAULT CURRENT_DATE,
    "data_envio" DATE,
    "quantidade_horas" INTEGER DEFAULT 0,
    "quantidade_moedas" INTEGER DEFAULT 0,
    "status_tarefa" BOOLEAN DEFAULT false,
    "id_colaborador" INTEGER,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id_tarefa")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "matricula" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "rg" VARCHAR(20),
    "email" VARCHAR(126) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "cargo" VARCHAR(126) NOT NULL,
    "periodo" INTEGER DEFAULT 1,
    "status" BOOLEAN DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "justificativas_id_tarefa_key" ON "justificativas"("id_tarefa");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gestores" ADD CONSTRAINT "gestores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "justificativas" ADD CONSTRAINT "justificativas_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "tarefas"("id_tarefa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefa_gestor_colaborador" ADD CONSTRAINT "tarefa_gestor_colaborador_id_colaborador_fkey" FOREIGN KEY ("id_colaborador") REFERENCES "colaboradores"("id_colaborador") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefa_gestor_colaborador" ADD CONSTRAINT "tarefa_gestor_colaborador_id_gestor_fkey" FOREIGN KEY ("id_gestor") REFERENCES "gestores"("id_gestor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefa_gestor_colaborador" ADD CONSTRAINT "tarefa_gestor_colaborador_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "tarefas"("id_tarefa") ON DELETE NO ACTION ON UPDATE NO ACTION;
