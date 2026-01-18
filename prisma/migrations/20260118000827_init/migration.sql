-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "genero" TEXT
);

-- CreateTable
CREATE TABLE "Loja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "abertura" TEXT NOT NULL DEFAULT '08:00',
    "fechamento" TEXT NOT NULL DEFAULT '22:00'
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "lojaId" INTEGER NOT NULL,
    CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lojaNome" TEXT NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "clienteUsername" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "endereco" TEXT NOT NULL,
    "pagamento" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itens" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
