import express from 'express';
import cors from 'cors';
import pg from 'pg';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Pool } = pg;
const { Client, LocalAuth } = pkg;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://postgres.pnlhyhckkfenglqdycfm:projetopedeai26@aws-0-us-west-2.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false 
    }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar no banco de dados:', err.message);
    }
    console.log('Conexão com o banco de dados pronta.');
    release();
});

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => {
    console.log('Aguardando scanner para o WhatsApp.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('O sistema de mensagens está ligado e pronto para uso.');
});

client.initialize();

app.post('/api/login', async (req, res) => {
    const { identificacao, senha } = req.body;
    console.log(`Verificando entrada para: ${identificacao}`);
    try {
        const query = "SELECT * FROM usuarios WHERE (LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)) AND senha = $2";
        const resDb = await pool.query(query, [identificacao.trim(), senha.trim()]);

        if (resDb.rows.length > 0) {
            const usuario = resDb.rows[0];
            console.log(`Entrada permitida: @${usuario.username}`);
            res.json(usuario);
        } else {
            console.log(`Dados incorretos para: ${identificacao}`);
            res.status(401).json({ mensagem: "Usuario ou senha incorretos." });
        }
    } catch (e) { 
        console.error("Erro ao consultar o banco de dados:", e.message);
        res.status(500).json({ msg: "Houve um problema no servidor." }); 
    }
});

app.post('/api/cadastro', async (req, res) => {
    const { nome, username, email, telefone, senha, tipo, genero } = req.body;
    try {
        const query = "INSERT INTO usuarios (nome, username, email, telefone, senha, tipo, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const novo = await pool.query(query, [nome, username, email, telefone, senha, tipo, genero]);
        console.log(`Novo cadastro realizado: @${username}`);
        res.status(201).json(novo.rows[0]);
    } catch (e) { 
        console.error("Erro ao realizar cadastro:", e.message);
        res.status(400).json({ mensagem: "Este usuario ou e-mail ja existe." }); 
    }
});

app.get('/api/lojas', async (req, res) => {
    try {
        const resDb = await pool.query("SELECT * FROM lojas ORDER BY id ASC");
        res.json(resDb.rows);
    } catch (e) { 
        console.error("Erro ao buscar lojas:", e.message);
        res.status(500).json([]); 
    }
});

app.get('/api/produtos', async (req, res) => {
    try {
        const resDb = await pool.query("SELECT * FROM produtos");
        res.json(resDb.rows);
    } catch (e) { 
        console.error("Erro ao buscar produtos:", e.message);
        res.status(500).json([]); 
    }
});

app.post('/api/pedidos', async (req, res) => {
    const p = req.body;
    try {
        const query = "INSERT INTO pedidos (loja_nome, cliente_nome, cliente_username, total, endereco, pagamento, status, itens) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
        const novo = await pool.query(query, [p.lojaNome, p.clienteNome, p.clienteUsername, p.total, p.endereco, p.pagamento, p.status, JSON.stringify(p.itens)]);
        console.log(`Pedido recebido: #${novo.rows[0].id.split('-')[0]}`);
        res.status(201).json(novo.rows[0]);
    } catch (e) { 
        console.error("Erro ao salvar o pedido:", e.message);
        res.status(500).json({ msg: "Nao foi possivel salvar o pedido." }); 
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const resDb = await pool.query("SELECT * FROM pedidos ORDER BY created_at DESC");
        res.json(resDb.rows);
    } catch (e) { 
        console.error("Erro ao listar pedidos:", e.message);
        res.status(500).json([]); 
    }
});

app.post('/api/pedidos/status', async (req, res) => {
    const { pedidoId, novoStatus } = req.body;
    try {
        const queryStatus = "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *";
        const pedidoRes = await pool.query(queryStatus, [novoStatus, pedidoId]);
        const pedido = pedidoRes.rows[0];

        const userRes = await pool.query("SELECT telefone FROM usuarios WHERE username = $1", [pedido.cliente_username]);
        const tel = userRes.rows[0]?.telefone;

        if (tel) {
            const msg = `PedeAi: Ola ${pedido.cliente_nome}! O seu pedido da loja ${pedido.loja_nome} mudou para: ${novoStatus}`;
            const num = tel.replace(/\D/g, "");
            await client.sendMessage(`55${num}@c.us`, msg);
            console.log(`Aviso enviado para o cliente no numero: ${num}`);
        }
        res.json(pedido);
    } catch (e) { 
        console.error("Erro ao atualizar o status:", e.message);
        res.status(404).json({ msg: "Nao encontramos esse pedido." }); 
    }
});

app.listen(PORT, () => {
    console.clear();
    console.log("-----------------------------------------");
    console.log(`SISTEMA PEDEAI NO AR`);
    console.log(`Banco de dados e servidor prontos.`);
    console.log(`Endereco: http://localhost:${PORT}`);
    console.log("-----------------------------------------");
});