import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- BANCO DE DADOS EM MEMÓRIA (AGORA TOTALMENTE DINÂMICO) ---
let usuarios = []; 

let lojas = [
  { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
  { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
  { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa' },
  { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa' },
];

/**
 * --- ROTAS DE AUTENTICAÇÃO ---
 */

// Rota de Cadastro: Aceita qualquer tipo (Cliente, Vendedor ou Admin)
app.post('/api/cadastro', (req, res) => {
  const novoUsuario = req.body;
  
  const usuarioExiste = usuarios.find(u => u.email === novoUsuario.email || u.username === novoUsuario.username);
  if (usuarioExiste) {
    return res.status(400).json({ mensagem: "Usuário ou E-mail já cadastrado." });
  }

  // O servidor salva exatamente o que vier do formulário (Nome, Tipo, etc)
  usuarios.push(novoUsuario);
  console.log(`✅ [Back-end] Novo ${novoUsuario.tipo} cadastrado: ${novoUsuario.nome}`);
  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
});

// Rota de Login: Identifica o perfil automaticamente
app.post('/api/login', (req, res) => {
  const { identificacao, senha } = req.body;
  
  const usuario = usuarios.find(u => 
    (u.username === identificacao || u.email === identificacao) && u.senha === senha
  );

  if (usuario) {
    console.log(`🔑 [Back-end] Login bem-sucedido: ${usuario.nome} (${usuario.tipo})`);
    const { senha, ...dadosUsuario } = usuario; // Retorna os dados sem a senha
    res.json(dadosUsuario);
  } else {
    res.status(401).json({ mensagem: "Credenciais inválidas." });
  }
});

/**
 * --- ROTAS DE DADOS ---
 */
app.get('/api/lojas', (req, res) => {
  res.json(lojas);
});

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🚀 SERVIDOR PEDEAÍ RODANDO: http://localhost:${PORT}`);
  console.log("📡 Pronto para cadastrar Clientes, Vendedores e Admins.");
  console.log("-----------------------------------------");
});