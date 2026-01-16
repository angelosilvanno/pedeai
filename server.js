import express from 'express';
import cors from 'cors';
import fs from 'fs';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const ARQUIVO_DB = './banco.json';

// --- INICIALIZAÇÃO DO WHATSAPP ---
console.log('⏳ [Sistema] Iniciando motor do WhatsApp...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.clear();
    console.log('---------------------------------------------------------');
    console.log('📱 [WhatsApp] SCANNER DE CONEXÃO');
    console.log('Escaneie o QR Code abaixo para ativar as notificações:');
    console.log('---------------------------------------------------------');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ [WhatsApp] STATUS: Conectado e pronto para enviar mensagens!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ [WhatsApp] Erro na autenticação:', msg);
});

client.initialize();

// --- GESTÃO DO BANCO DE DADOS ---
const lerBanco = () => {
    try {
        if (!fs.existsSync(ARQUIVO_DB)) {
            console.log('📂 [Banco] Arquivo não encontrado. Criando base de dados vazia...');
            const baseVazia = { usuarios: [], lojas: [], produtos: [], pedidos: [] };
            fs.writeFileSync(ARQUIVO_DB, JSON.stringify(baseVazia, null, 2));
            return baseVazia;
        }
        return JSON.parse(fs.readFileSync(ARQUIVO_DB, 'utf-8'));
    } catch (error) {
        console.error('❌ [Banco] Erro ao ler arquivo:', error.message);
        return { usuarios: [], lojas: [], produtos: [], pedidos: [] };
    }
};

const salvarBanco = (dados) => {
    try {
        fs.writeFileSync(ARQUIVO_DB, JSON.stringify(dados, null, 2));
        console.log('💾 [Banco] Alterações salvas com sucesso no banco.json.');
    } catch (error) {
        console.error('❌ [Banco] Falha ao persistir dados:', error.message);
    }
};

// --- SERVIÇO DE NOTIFICAÇÃO ---
const enviarAvisoWhatsApp = async (telefone, mensagem) => {
    try {
        const numeroLimpo = telefone.replace(/\D/g, "");
        const chatId = `55${numeroLimpo}@c.us`; 
        await client.sendMessage(chatId, mensagem);
        console.log(`📩 [Notificação] Mensagem enviada para: ${telefone}`);
    } catch (error) {
        console.error(`❌ [Notificação] Erro ao enviar para ${telefone}:`, error.message);
    }
};

/**
 * --- ROTAS DA API ---
 */

// Login com log de atividade
app.post('/api/login', (req, res) => {
    const { identificacao, senha } = req.body;
    const banco = lerBanco();
    const usuario = banco.usuarios.find(u => (u.username === identificacao || u.email === identificacao) && u.senha === senha);
    
    if (usuario) {
        const { senha, ...dados } = usuario;
        console.log(`🔑 [Acesso] Login realizado: @${usuario.username}`);
        res.json(dados);
    } else {
        console.log(`⚠️ [Acesso] Tentativa de login inválida: ${identificacao}`);
        res.status(401).json({ mensagem: "Credenciais inválidas." });
    }
});

// Cadastro de novos usuários
app.post('/api/cadastro', (req, res) => {
    const novo = req.body;
    const banco = lerBanco();
    
    if (banco.usuarios.find(u => u.email === novo.email || u.username === novo.username)) {
        console.log(`⚠️ [Cadastro] Tentativa de duplicar usuário: ${novo.email}`);
        return res.status(400).json({ msg: "Usuário ou E-mail já cadastrado" });
    }
    
    banco.usuarios.push(novo);
    salvarBanco(banco);
    console.log(`👤 [Cadastro] Novo usuário registrado: @${novo.username}`);
    res.status(201).json({ msg: "Cadastro realizado!" });
});

// ROTA MESTRA: Atualização de Status e WhatsApp
app.post('/api/pedidos/status', async (req, res) => {
    const { pedidoId, novoStatus } = req.body;
    const banco = lerBanco();
    
    const pedido = banco.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        console.log(`❓ [Pedido] ID ${pedidoId} não localizado.`);
        return res.status(404).json({ msg: "Pedido não encontrado" });
    }

    const cliente = banco.usuarios.find(u => u.username === pedido.clienteUsername);
    
    console.log(`🔄 [Pedido] Status alterado: Pedido #${pedidoId} -> ${novoStatus}`);
    pedido.status = novoStatus;
    salvarBanco(banco);

    if (cliente && cliente.telefone) {
        let msgTexto = "";
        switch(novoStatus) {
            case 'Preparando':
                msgTexto = `Olá ${pedido.clienteNome}! Seu pedido da *${pedido.lojaNome}* já está sendo preparado! 👨‍🍳`;
                break;
            case 'Saiu para Entrega':
                msgTexto = `Boa notícia! Seu pedido da *${pedido.lojaNome}* saiu para entrega e chegará em breve. 🛵`;
                break;
            case 'Entregue':
                msgTexto = `Pedido entregue! Esperamos que goste da sua refeição. Bom apetite! 😋`;
                break;
        }

        if (msgTexto) {
            await enviarAvisoWhatsApp(cliente.telefone, msgTexto);
        }
    } else {
        console.log(`⚠️ [Notificação] Cliente @${pedido.clienteUsername} não possui telefone cadastrado.`);
    }

    res.json({ msg: "Status atualizado e cliente notificado!" });
});

app.get('/api/lojas', (req, res) => {
    const banco = lerBanco();
    res.json(banco.lojas);
});

app.get('/api/produtos', (req, res) => {
    const banco = lerBanco();
    res.json(banco.produtos);
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.clear();
    console.log('---------------------------------------------------------');
    console.log(`🚀 [Servidor] PedeAí Online em: http://localhost:${PORT}`);
    console.log('📡 [Servidor] Aguardando requisições do App...');
    console.log('---------------------------------------------------------');
});