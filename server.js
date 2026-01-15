import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ARQUIVO_DB = './banco.json';

// Função para ler o que está salvo no arquivo
const lerBanco = () => {
  if (!fs.existsSync(ARQUIVO_DB)) {
    return { usuarios: [], lojas: [], produtos: [] };
  }
  const dados = fs.readFileSync(ARQUIVO_DB, 'utf-8');
  return JSON.parse(dados);
};

// Função para salvar os dados no arquivo
const salvarBanco = (dados) => {
  fs.writeFileSync(ARQUIVO_DB, JSON.stringify(dados, null, 2));
};

// Iniciamos os dados lendo do arquivo
let banco = lerBanco();

// Se o arquivo estiver vazio, colocamos as lojas padrão
if (banco.lojas.length === 0) {
  banco.lojas = [
    { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
    { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
    { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa' },
    { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa' },
  ];
  salvarBanco(banco);
}

/**
 * --- ROTAS ---
 */

app.post('/api/cadastro', (req, res) => {
  const novoUsuario = req.body;
  const bancoAtual = lerBanco();

  const existe = bancoAtual.usuarios.find(u => u.email === novoUsuario.email || u.username === novoUsuario.username);
  if (existe) return res.status(400).json({ mensagem: "Usuário já cadastrado." });

  bancoAtual.usuarios.push(novoUsuario);
  salvarBanco(bancoAtual); // Salva no arquivo!
  
  console.log(`✅ Novo ${novoUsuario.tipo} salvo no arquivo: ${novoUsuario.nome}`);
  res.status(201).json({ mensagem: "Sucesso!" });
});

app.post('/api/login', (req, res) => {
  const { identificacao, senha } = req.body;
  const bancoAtual = lerBanco();

  const usuario = bancoAtual.usuarios.find(u => 
    (u.username === identificacao || u.email === identificacao) && u.senha === senha
  );

  if (usuario) {
    const { senha, ...dadosUsuario } = usuario;
    res.json(dadosUsuario);
  } else {
    res.status(401).json({ mensagem: "Credenciais inválidas." });
  }
});

app.get('/api/lojas', (req, res) => {
  const bancoAtual = lerBanco();
  res.json(bancoAtual.lojas);
});

app.get('/api/produtos', (req, res) => {
  const bancoAtual = lerBanco();
  res.json(bancoAtual.produtos.length > 0 ? bancoAtual.produtos : [
    { id: 'p1', lojaId: 1, nome: "Margherita Especial", preco: 48.90, descricao: "Molho artesanal e manjericão." },
    { id: 'h1', lojaId: 2, nome: "Smash Mari Clássico", preco: 26.50, descricao: "Cheddar e molho secreto." }
  ]);
});

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🚀 SERVIDOR COM MEMÓRIA ATIVO: http://localhost:${PORT}`);
  console.log(`📂 Os dados estão sendo salvos em: ${ARQUIVO_DB}`);
  console.log("-----------------------------------------");
});