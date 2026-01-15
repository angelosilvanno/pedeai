import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ARQUIVO_DB = './banco.json';

const lerBanco = () => {
  if (!fs.existsSync(ARQUIVO_DB)) {
    return { usuarios: [], lojas: [], produtos: [] };
  }
  const dados = fs.readFileSync(ARQUIVO_DB, 'utf-8');
  return JSON.parse(dados);
};

const salvarBanco = (dados) => {
  fs.writeFileSync(ARQUIVO_DB, JSON.stringify(dados, null, 2));
};

let banco = lerBanco();

if (banco.lojas.length === 0) {
  banco.lojas = [
    { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa', abertura: "18:00", fechamento: "23:59" },
    { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa', abertura: "11:00", fechamento: "23:00" },
    { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa', abertura: "09:00", fechamento: "18:00" },
    { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa', abertura: "18:30", fechamento: "23:30" },
  ];
  salvarBanco(banco);
}

app.post('/api/cadastro', (req, res) => {
  const novoUsuario = req.body;
  const bancoAtual = lerBanco();
  const existe = bancoAtual.usuarios.find(u => u.email === novoUsuario.email || u.username === novoUsuario.username);
  if (existe) return res.status(400).json({ mensagem: "Usuário já cadastrado." });
  bancoAtual.usuarios.push(novoUsuario);
  salvarBanco(bancoAtual);
  res.status(201).json({ mensagem: "Sucesso!" });
});

app.post('/api/login', (req, res) => {
  const { identificacao, senha } = req.body;
  const bancoAtual = lerBanco();
  const usuario = bancoAtual.usuarios.find(u => (u.username === identificacao || u.email === identificacao) && u.senha === senha);
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
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});