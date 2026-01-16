import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ARQUIVO_DB = './banco.json';

/**
 * Função para ler os dados do arquivo
 */
const lerBanco = () => {
  if (!fs.existsSync(ARQUIVO_DB)) {
    return { usuarios: [], lojas: [], produtos: [] };
  }
  const dados = fs.readFileSync(ARQUIVO_DB, 'utf-8');
  return JSON.parse(dados);
};

/**
 * Função para salvar os dados no arquivo banco.json
 */
const salvarBanco = (dados) => {
  fs.writeFileSync(ARQUIVO_DB, JSON.stringify(dados, null, 2));
};

// Inicialização do banco de dados
let banco = lerBanco();

// DICA TÉCNICA: Garantir que as lojas e produtos básicos existam no arquivo
// Isso automatiza a atualização sempre que o servidor inicia
const inicializarDadosBasicos = () => {
  const lojasIniciais = [
    { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa', abertura: "18:00", fechamento: "23:59" },
    { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa', abertura: "11:00", fechamento: "23:00" },
    { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa', abertura: "09:00", fechamento: "18:00" },
    { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa', abertura: "18:30", fechamento: "23:30" },
  ];

  const produtosIniciais = [
    // Pizzaria Oliveira (lojaId: 1)
    { id: 'p1', lojaId: 1, nome: "Margherita Especial", preco: 48.90, descricao: "Molho artesanal, muçarela premium, tomate cereja e manjericão fresco." },
    { id: 'p2', lojaId: 1, nome: "Calabresa com Cebola Roxa", preco: 45.00, descricao: "Calabresa defumada, cebola roxa caramelizada e azeitonas pretas." },
    { id: 'p3', lojaId: 1, nome: "Frango com Catupiry Real", preco: 52.00, descricao: "Peito de frango desfiado com tempero da casa e Catupiry legítimo." },
    
    // Burger da Mari (lojaId: 2)
    { id: 'h1', lojaId: 2, nome: "Smash Mari Clássico", preco: 26.50, descricao: "Dois blends de 90g, cheddar derretido e molho secreto no pão brioche." },
    { id: 'h2', lojaId: 2, nome: "Bacon Supreme", preco: 32.90, descricao: "Carne 160g grelhada, bacon crocante, maionese defumada e picles." },
    { id: 'h3', lojaId: 2, nome: "Batata Rústica Individual", preco: 18.00, descricao: "Batatas crocantes com alecrim, alho e sal grosso." },

    // Doçuras da Ana (lojaId: 3)
    { id: 'd1', lojaId: 3, nome: "Ninho com Nutella", preco: 18.00, descricao: "Camadas generosas de creme de leite Ninho e cobertura de Nutella pura." },
    { id: 'd2', lojaId: 3, nome: "Fatia Torta Holandesa", preco: 15.50, descricao: "Base crocante de biscoito, creme de baunilha e ganache meio amargo." },
    { id: 'd3', lojaId: 3, nome: "Brigadeiro de Pistache", preco: 6.50, descricao: "Gourmet feito com chocolate belga branco e pistache triturado." },

    // Tanaka Sushi (lojaId: 4)
    { id: 'j1', lojaId: 4, nome: "Combinado Premium (15pçs)", preco: 65.00, descricao: "5 Sashimis, 5 Uramakis Philadelphia e 5 Hossomakis de Kani." },
    { id: 'j2', lojaId: 4, nome: "Temaki Salmão Completo", preco: 34.90, descricao: "Salmão fresco em cubos, cream cheese e cebolinha crocante." },
    { id: 'j3', lojaId: 4, nome: "Hot Roll Especial", preco: 28.00, descricao: "Salmão empanado frito com molho tarê e gergelim tostado." },
  ];

  // Só adiciona se o banco estiver vazio de lojas ou produtos
  if (banco.lojas.length === 0) banco.lojas = lojasIniciais;
  if (banco.produtos.length === 0) banco.produtos = produtosIniciais;

  salvarBanco(banco);
};

// Executa a inicialização ao ligar o servidor
inicializarDadosBasicos();

/**
 * --- ROTAS DA API ---
 */

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

app.post('/api/cadastro', (req, res) => {
  const novoUsuario = req.body;
  const bancoAtual = lerBanco();
  const existe = bancoAtual.usuarios.find(u => u.email === novoUsuario.email || u.username === novoUsuario.username);
  if (existe) return res.status(400).json({ mensagem: "Usuário já cadastrado." });
  bancoAtual.usuarios.push(novoUsuario);
  
  // Salvar no arquivo banco.json para garantir a persistência
  salvarBanco(bancoAtual);
  
  res.status(201).json({ mensagem: "Sucesso!" });
});

app.get('/api/lojas', (req, res) => {
  const bancoAtual = lerBanco();
  res.json(bancoAtual.lojas);
});

app.get('/api/produtos', (req, res) => {
  const bancoAtual = lerBanco();
  res.json(bancoAtual.produtos);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com cardápio completo em http://localhost:${PORT}`);
});