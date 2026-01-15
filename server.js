import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- BANCO DE DADOS EM MEMÓRIA ---

let usuarios = []; 

let lojas = [
  { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
  { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
  { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa' },
  { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa' },
];

// PRODUTOS AGORA MORAM AQUI NO SERVIDOR
let produtos = [
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
  // Tanaka Sushi (lojaId: 4)
  { id: 'j1', lojaId: 4, nome: "Combinado Premium (15pçs)", preco: 65.00, descricao: "5 Sashimis, 5 Uramakis Philadelphia e 5 Hossomakis de Kani." },
  { id: 'j2', lojaId: 4, nome: "Temaki Salmão Completo", preco: 34.90, descricao: "Salmão fresco em cubos, cream cheese e cebolinha crocante." },
];

/**
 * --- ROTAS DA API ---
 */

// LOGIN
app.post('/api/login', (req, res) => {
  const { identificacao, senha } = req.body;
  const usuario = usuarios.find(u => (u.username === identificacao || u.email === identificacao) && u.senha === senha);

  if (usuario) {
    const { senha, ...dadosUsuario } = usuario;
    res.json(dadosUsuario);
  } else {
    res.status(401).json({ mensagem: "Credenciais inválidas." });
  }
});

// CADASTRO
app.post('/api/cadastro', (req, res) => {
  const novoUsuario = req.body;
  const existe = usuarios.find(u => u.email === novoUsuario.email || u.username === novoUsuario.username);
  if (existe) return res.status(400).json({ mensagem: "Usuário já cadastrado." });

  usuarios.push(novoUsuario);
  res.status(201).json({ mensagem: "Sucesso!" });
});

// BUSCAR LOJAS
app.get('/api/lojas', (req, res) => {
  res.json(lojas);
});

// BUSCAR PRODUTOS (A NOVA ROTA QUE O APP VAI CHAMAR)
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🚀 SERVIDOR PEDEAÍ RODANDO: http://localhost:${PORT}`);
  console.log("-----------------------------------------");
});