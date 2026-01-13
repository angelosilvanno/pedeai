import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; // O servidor vai rodar nesta porta

// Configurações
app.use(cors()); // Permite que o Frontend (Vite) acesse o Backend
app.use(express.json()); // Permite que o servidor entenda mensagens em formato JSON

/**
 * --- ROTAS DA API ---
 */

// Rota de teste para ver se o banco de dados fake está ok
app.get('/api/lojas', (req, res) => {
  const lojas = [
    { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", status: 'Ativa' },
    { id: 2, nome: "Burger da Mari", categoria: "Lanches", status: 'Ativa' },
    { id: 3, nome: "Tanaka Sushi", categoria: "Japonesa", status: 'Ativa' }
  ];
  
  console.log("📡 [Back-end] Enviando lista de lojas para o cliente...");
  res.json(lojas);
});

// Rota para receber um novo pedido (POST)
app.post('/api/pedidos', (req, res) => {
  const novoPedido = req.body;
  console.log("📦 [Back-end] Novo pedido recebido:", novoPedido.id);
  
  // Aqui no futuro salvaremos em um banco de dados real
  res.status(201).json({ mensagem: "Pedido processado com sucesso pelo servidor!" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🚀 SERVIDOR API RODANDO: http://localhost:${PORT}`);
  console.log("📡 Aguardando chamadas do PedeAí Front-end...");
  console.log("-----------------------------------------");
});