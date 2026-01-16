import express from 'express';
import cors from 'cors';
import fs from 'fs';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ARQUIVO_DB = './banco.json';

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

const lerBanco = () => {
    try {
        if (!fs.existsSync(ARQUIVO_DB)) {
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
        console.log('💾 [Banco] Dados atualizados com sucesso.');
    } catch (error) {
        console.error('❌ [Banco] Falha ao salvar dados:', error.message);
    }
};

const enviarAvisoWhatsApp = async (telefone, mensagem) => {
    try {
        let num = telefone.replace(/\D/g, "");
        
        if (!num.startsWith("55")) {
            num = "55" + num;
        }

        const chatId = `${num}@c.us`;
        
        console.log(`📡 [WhatsApp] Tentando enviar para ID: ${chatId}`);
        await client.sendMessage(chatId, mensagem);
        console.log(`✅ [WhatsApp] Mensagem entregue!`);
    } catch (error) {
        console.error(`❌ [WhatsApp] Erro no envio para ${telefone}:`, error.message);
    }
};

app.post('/api/login', (req, res) => {
    const { identificacao, senha } = req.body;
    const banco = lerBanco();
    const usuario = banco.usuarios.find(u => (u.username === identificacao || u.email === identificacao) && u.senha === senha);
    
    if (usuario) {
        const { senha, ...dados } = usuario;
        console.log(`🔑 [Acesso] Login: @${usuario.username}`);
        res.json(dados);
    } else {
        res.status(401).json({ mensagem: "Credenciais inválidas." });
    }
});

app.post('/api/cadastro', (req, res) => {
    const novo = req.body;
    const banco = lerBanco();
    
    if (banco.usuarios.find(u => u.email === novo.email || u.username === novo.username)) {
        return res.status(400).json({ msg: "Usuário já cadastrado" });
    }
    
    banco.usuarios.push(novo);
    salvarBanco(banco);
    console.log(`👤 [Cadastro] Novo usuário: @${novo.username}`);
    res.status(201).json({ msg: "Ok" });
});

app.post('/api/pedidos', (req, res) => {
    const novoPedido = req.body;
    const banco = lerBanco();
    
    banco.pedidos.push(novoPedido);
    salvarBanco(banco);
    
    console.log(`📦 [Pedido] Novo pedido recebido: #${novoPedido.id} de @${novoPedido.clienteUsername}`);
    res.status(201).json({ msg: "Pedido salvo com sucesso", pedido: novoPedido });
});

app.get('/api/pedidos', (req, res) => {
    const banco = lerBanco();
    res.json(banco.pedidos);
});

app.post('/api/pedidos/status', async (req, res) => {
    const { pedidoId, novoStatus } = req.body;
    const banco = lerBanco();
    
    const pedido = banco.pedidos.find(p => p.id === pedidoId);
    if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

    const cliente = banco.usuarios.find(u => u.username === pedido.clienteUsername);
    
    pedido.status = novoStatus;
    salvarBanco(banco);
    console.log(`🔄 [Pedido] #${pedidoId} alterado para: ${novoStatus}`);

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
    }

    res.json({ msg: "Status atualizado!" });
});

app.get('/api/lojas', (req, res) => res.json(lerBanco().lojas));
app.get('/api/produtos', (req, res) => res.json(lerBanco().produtos));

app.listen(PORT, () => {
    console.clear();
    console.log('---------------------------------------------------------');
    console.log(`🚀 [Servidor] PedeAí Online em: http://localhost:${PORT}`);
    console.log('📡 Monitorando disparos de WhatsApp...');
    console.log('---------------------------------------------------------');
});