import { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Pizza, UtensilsCrossed, CakeSlice, Fish, Stethoscope, Store } from 'lucide-react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'
import Cliente from './components/Cliente'
import Vendedor from './components/Vendedor'
import Admin from './components/Admin'

type Perfil = 'Cliente' | 'Vendedor' | 'Admin';

export default function App() {
  // --- 1. ESTADOS DO USUÁRIO LOGADO ---
  const [estaLogado, setEstaLogado] = useState(() => localStorage.getItem('@PedeAi:estaLogado') === 'true');
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState(() => localStorage.getItem('@PedeAi:nome') || '');
  const [usuarioUsername, setUsuarioUsername] = useState(() => localStorage.getItem('@PedeAi:username') || '');
  const [usuarioEmail, setUsuarioEmail] = useState(() => localStorage.getItem('@PedeAi:email') || '');
  const [usuarioTelefone, setUsuarioTelefone] = useState(() => localStorage.getItem('@PedeAi:telefone') || '');
  const [tipoUsuario, setTipoUsuario] = useState<Perfil>(() => (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente');
  const [visao, setVisao] = useState<Perfil>(() => (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente');

  const [cidadeUsuario, setCidadeUsuario] = useState('Localizando...');

  // --- 2. ESTADOS DO FORMULÁRIO (UX SEMPRE LIMPA) ---
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  const [formNome, setFormNome] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formSenha, setFormSenha] = useState('');
  const [formSenhaConfirm, setFormSenhaConfirm] = useState('');
  const [formNomeLoja, setFormNomeLoja] = useState('');

  // --- 3. DADOS DO SISTEMA ---
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([]);
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>(() => JSON.parse(localStorage.getItem('@PedeAi:produtos') || '[]'));
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>(() => JSON.parse(localStorage.getItem('@PedeAi:pedidos') || '[]'));
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // --- 4. LOGICA DE LOCALIZAÇÃO ---
  useEffect(() => {
    fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setCidadeUsuario(`${d.city}, ${d.region_code}`)).catch(() => setCidadeUsuario("Brasil"));
  }, []);

  // --- 5. LOGICA DE API DE LOJAS ---
  useEffect(() => {
    if (estaLogado) {
      fetch('http://localhost:3000/api/lojas')
        .then(res => res.json())
        .then(dados => setTodasAsLojas(dados))
        .catch(() => notify("Erro ao conectar com o servidor.", 'erro'));
    }
  }, [estaLogado]);

  useEffect(() => { localStorage.setItem('@PedeAi:produtos', JSON.stringify(todosOsProdutos)); }, [todosOsProdutos]);
  useEffect(() => { localStorage.setItem('@PedeAi:pedidos', JSON.stringify(todosOsPedidos)); }, [todosOsPedidos]);

  // --- 6. HANDLERS DE AUTENTICAÇÃO VIA API ---
  const handleLogin = async () => {
    const identificacao = formUsername || formEmail;
    if (!identificacao || !formSenha) return notify("Informe login e senha.", 'erro');

    try {
      const resposta = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacao, senha: formSenha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        // ATUALIZA O ESTADO COM O NOME REAL DO ADMIN VINDO DA API
        setUsuarioNomeCompleto(dados.nome);
        setUsuarioUsername(dados.username);
        setUsuarioEmail(dados.email);
        setUsuarioTelefone(dados.telefone);
        setTipoUsuario(dados.tipo);
        setVisao(dados.tipo); // Define se mostra a tela de Cliente, Vendedor ou Admin
        setEstaLogado(true);

        localStorage.setItem('@PedeAi:estaLogado', 'true');
        localStorage.setItem('@PedeAi:nome', dados.nome);
        localStorage.setItem('@PedeAi:username', dados.username);
        localStorage.setItem('@PedeAi:email', dados.email);
        localStorage.setItem('@PedeAi:telefone', dados.telefone);
        localStorage.setItem('@PedeAi:tipo', dados.tipo);

        notify(`Bem-vindo, ${dados.nome.split(' ')[0]}!`);
      } else {
        notify("Usuário ou senha incorretos.", 'erro');
      }
    } catch {
      notify("Servidor offline.", 'erro');
    }
  };

  const handleCadastro = async () => {
    if (!formNome || !formUsername || !formEmail || !formSenha) return notify("Preencha todos os campos.", 'erro');
    if (tipoUsuario !== 'Admin' && !formTelefone) return notify("Telefone obrigatório.", 'erro');
    
    const nomeF = formNome.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    
    try {
      const resposta = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nomeF,
          username: formUsername.toLowerCase().trim(),
          email: formEmail.toLowerCase(),
          telefone: formTelefone,
          senha: formSenha,
          tipo: tipoUsuario
        })
      });

      if (resposta.ok) {
        notify("Cadastro realizado! Faça login.");
        setTelaAuth('Login');
        setFormNome(''); setFormUsername(''); setFormEmail(''); setFormTelefone(''); setFormSenha('');
      } else {
        const erro = await resposta.json();
        notify(erro.mensagem, 'erro');
      }
    } catch {
      notify("Erro no servidor.", 'erro');
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.clear();
      setEstaLogado(false);
      setFormNome(''); setFormUsername(''); setFormEmail('');
      notify("Sessão encerrada.");
    }
  };

  const getStoreIcon = (name: string) => {
    const props = { size: 32, className: "text-orange-600" };
    switch (name) {
      case 'Pizza': return <Pizza {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'CakeSlice': return <CakeSlice {...props} />;
      case 'Fish': return <Fish {...props} />;
      case 'Stethoscope': return <Stethoscope {...props} />;
      default: return <Store {...props} />;
    }
  };

  if (!estaLogado) {
    return (
      <AuthScreen 
        telaAuth={telaAuth} setTelaAuth={setTelaAuth}
        campoLoginIdentificacao={formUsername} setCampoLoginIdentificacao={setFormUsername}
        campoLoginSenha={formSenha} setCampoLoginSenha={setFormSenha}
        usuarioNomeCompleto={formNome} setUsuarioNomeCompleto={setFormNome}
        usuarioUsername={formUsername} setUsuarioUsername={setFormUsername}
        usuarioEmail={formEmail} setUsuarioEmail={setFormEmail}
        usuarioTelefone={formTelefone} setUsuarioTelefone={setFormTelefone}
        usuarioSenha={formSenha} setUsuarioSenha={setFormSenha}
        usuarioSenhaConfirm={formSenhaConfirm} setUsuarioSenhaConfirm={setFormSenhaConfirm}
        tipoUsuario={tipoUsuario} setTipoUsuario={setTipoUsuario}
        nomeLoja={formNomeLoja} setNomeLoja={setFormNomeLoja}
        handleLogin={handleLogin} handleCadastro={handleCadastro}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans selection:bg-orange-200">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl bg-zinc-900 text-white animate-in slide-in-from-top duration-300">
           <CheckCircle size={18} /> <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}
      <header className="relative bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mx-auto max-w-xl">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Olá, {usuarioNomeCompleto.split(' ')[0]}!</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none mt-1">PedeAí</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold">
            <MapPin size={12} /> {cidadeUsuario}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-xl p-5">
        {visao === 'Cliente' && <Cliente todasAsLojas={todasAsLojas} 
        todosOsProdutos={todosOsProdutos} 
        todosOsPedidos={todosOsPedidos} 
        setTodosOsPedidos={setTodosOsPedidos} 
        usuarioNomeCompleto={usuarioNomeCompleto} 
        usuarioUsername={usuarioUsername} 
        usuarioEmail={usuarioEmail} 
        usuarioTelefone={usuarioTelefone} 
        handleLogout={handleLogout} 
        notify={notify} 
        getStoreIcon={getStoreIcon} />}

        {visao === 'Vendedor' && 
        <Vendedor todosOsPedidos={todosOsPedidos} 
        setTodosOsPedidos={setTodosOsPedidos} 
        todosOsProdutos={todosOsProdutos} 
        setTodosOsProdutos={setTodosOsProdutos} 
        notify={notify} 
        handleLogout={handleLogout} 
        usuarioNomeCompleto={usuarioNomeCompleto} 
        usuarioEmail={usuarioEmail} />}

        {visao === 'Admin' && 
        <Admin todasAsLojas={todasAsLojas} 
        setTodasAsLojas={setTodasAsLojas} 
        todosOsPedidos={todosOsPedidos} 
        getStoreIcon={getStoreIcon} 
        notify={notify} 
        handleLogout={handleLogout} 
        usuarioNomeCompleto={usuarioNomeCompleto} 
        usuarioEmail={usuarioEmail} />}
      </main>
    </div>
  );
}