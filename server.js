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

// --- CONEXÃO COM O BANCO DE DADOS (SUPABASE) ---
const pool = new Pool({
    connectionString: "COLE_AQUI_A_SUA_URI_DO_SUPABASE",
});

// --- MOTOR DO WHATSAPP ---
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.clear();
    console.log('---------------------------------------------------------');
    console.log('SISTEMA DE MENSAGENS');
    console.log('Abra o WhatsApp no seu celular e leia o código abaixo:');
    console.log('---------------------------------------------------------');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\nTudo pronto! O WhatsApp está conectado.');
});

client.initialize();

// --- FUNÇÃO PARA ENVIAR MENSAGEM ---
const enviarMensagem = async (telefone, texto) => {
    try {
        let num = telefone.replace(/\D/g, "");
        if (num.length === 11 && num.startsWith("0")) num = num.substring(1);
        if (!num.startsWith("55")) num = "55" + num;

        const contatoId = `${num}@c.us`;
        await client.sendMessage(contatoId, texto);
        console.log('Mensagem enviada para: ' + telefone);
    } catch (erro) {
        console.log('Não foi possível enviar mensagem para: ' + telefone);
    }
};

// --- ACESSO E CADASTRO ---

app.post('/api/login', async (req, res) => {
    const { identificacao, senha } = req.body;
    try {
        const consulta = "SELECT * FROM usuarios WHERE (username = $1 OR email = $1) AND senha = $2";
        const resultado = await pool.query(consulta, [identificacao, senha]);

        if (resultado.rows.length > 0) {
            const usuario = resultado.rows[0];
            console.log('Alguém entrou no sistema: ' + usuario.username);
            res.json(usuario);
        } else {
            res.status(401).json({ mensagem: "Usuário ou senha não conferem." });
        }
    } catch (e) {
        res.status(500).json({ mensagem: "Problema ao consultar o banco de dados." });
    }
});

app.post('/api/cadastro', async (req, res) => {
    const { nome, username, email, telefone, senha, tipo, genero } = req.body;
    try {
        const consulta = "INSERT INTO usuarios (nome, username, email, telefone, senha, tipo, genero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const novo = await pool.query(consulta, [nome, username, email, telefone, senha, tipo, genero]);
        console.log('Novo cadastro realizado: ' + username);
        res.status(201).json(novo.rows[0]);
    } catch (e) {
        res.status(400).json({ mensagem: "Este nome de usuário ou e-mail já está em uso." });
    }
});

// --- LOJAS E PRODUTOS ---

app.get('/api/lojas', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM lojas ORDER BY nome ASC");
        res.json(resultado.rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.get('/api/produtos', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM produtos ORDER BY nome ASC");
        res.json(resultado.rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

// --- PEDIDOS ---

app.post('/api/pedidos', async (req, res) => {
    const p = req.body;
    try {
        const consulta = "INSERT INTO pedidos (loja_nome, cliente_nome, cliente_username, total, endereco, pagamento, status, itens) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
        const novo = await pool.query(consulta, [p.lojaNome, p.clienteNome, p.clienteUsername, p.total, p.endereco, p.pagamento, p.status, JSON.stringify(p.itens)]);
        console.log('Novo pedido de ' + p.clienteNome + ' para a loja ' + p.lojaNome);
        res.status(201).json(novo.rows[0]);
    } catch (e) {
        res.status(500).json({ mensagem: "Não foi possível salvar o pedido." });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM pedidos ORDER BY id DESC");
        res.json(resultado.rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.post('/api/pedidos/status', async (req, res) => {
    const { pedidoId, novoStatus } = req.body;
    try {
        const consultaStatus = "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *";
        const resultadoPedido = await pool.query(consultaStatus, [novoStatus, pedidoId]);
        const pedido = resultadoPedido.rows[0];

        const consultaUsuario = await pool.query("SELECT telefone FROM usuarios WHERE username = $1", [pedido.cliente_username]);
        const tel = consultaUsuario.rows[0]?.telefone;

        console.log('Pedido ' + pedidoId + ' mudou para: ' + novoStatus);

        if (tel) {
            let aviso = `Olá ${pedido.cliente_nome}! Seu pedido na ${pedido.loja_nome} agora está: ${novoStatus}`;
            await enviarMensagem(tel, aviso);
        }
        res.json(pedido);
    } catch (e) {
        res.status(404).json({ mensagem: "Erro ao atualizar a situação do pedido." });
    }
});

app.listen(PORT, () => {
    console.clear();
    console.log('---------------------------------------------------------');
    console.log('SERVIDOR DO PEDEAÍ ESTÁ NO AR');
    console.log('Banco de dados conectado e sistema pronto.');
    console.log('Endereço: http://localhost:' + PORT);
    console.log('---------------------------------------------------------');
});