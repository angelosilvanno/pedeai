import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  MapPin, 
  Pizza, 
  UtensilsCrossed, 
  CakeSlice, 
  Fish, 
  Stethoscope, 
  Store 
} from 'lucide-react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'
import Cliente from './components/Cliente'
import Vendedor from './components/Vendedor'
import Admin from './components/Admin'

type Perfil = 'Cliente' | 'Vendedor' | 'Admin';

export default function App() {
  const [estaLogado, setEstaLogado] = useState(() => localStorage.getItem('@PedeAi:estaLogado') === 'true');
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState(() => localStorage.getItem('@PedeAi:nome') || '');
  const [usuarioUsername, setUsuarioUsername] = useState(() => localStorage.getItem('@PedeAi:username') || '');
  const [usuarioEmail, setUsuarioEmail] = useState(() => localStorage.getItem('@PedeAi:email') || '');
  const [usuarioTelefone, setUsuarioTelefone] = useState(() => localStorage.getItem('@PedeAi:telefone') || '');
  
  const [tipoUsuario, setTipoUsuario] = useState<Perfil>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente';
  });

  const [visao, setVisao] = useState<Perfil>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente';
  });

  const [cidadeUsuario, setCidadeUsuario] = useState('Localizando...');

  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  const [formNome, setFormNome] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formSenha, setFormSenha] = useState('');
  const [formSenhaConfirm, setFormSenhaConfirm] = useState('');
  const [formNomeLoja, setFormNomeLoja] = useState('');

  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([]);
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:produtos');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:pedidos');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const buscarLocalizacaoReal = async () => {
      try {
        const resposta = await fetch('https://ipapi.co/json/');
        const dados = await resposta.json();
        if (dados.city && dados.region_code) {
          setCidadeUsuario(`${dados.city}, ${dados.region_code}`);
        } else {
          setCidadeUsuario("Localização Indisponível");
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
        setCidadeUsuario("Brasil");
      }
    };
    buscarLocalizacaoReal();
  }, []);

  useEffect(() => {
    if (estaLogado) {
      fetch('http://localhost:3000/api/lojas')
        .then(res => res.json())
        .then(dados => setTodasAsLojas(dados))
        .catch(() => {
          setTodasAsLojas([
            { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
            { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
          ]);
        });
    }
  }, [estaLogado]);

  useEffect(() => { localStorage.setItem('@PedeAi:produtos', JSON.stringify(todosOsProdutos)); }, [todosOsProdutos]);
  useEffect(() => { localStorage.setItem('@PedeAi:pedidos', JSON.stringify(todosOsPedidos)); }, [todosOsPedidos]);

  const handleLogin = () => {
    const identificacao = formUsername || formEmail;
    if (!identificacao || !formSenha) {
      notify("Informe login e senha.", 'erro');
      return;
    }
    const nomeF = usuarioNomeCompleto || "Usuário PedeAí";
    localStorage.setItem('@PedeAi:estaLogado', 'true');
    setEstaLogado(true);
    setVisao(tipoUsuario);
    notify(`Bem-vindo, ${nomeF.split(' ')[0]}!`);
  };

  const handleCadastro = () => {
    if (!formNome || !formUsername || !formEmail || !formSenha || !formTelefone) {
      notify("Preencha todos os campos.", 'erro');
      return;
    }
    if (formSenha !== formSenhaConfirm) {
      notify("Senhas não coincidem!", 'erro');
      return;
    }

    const nomeFormatado = formNome.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    const userFormatado = formUsername.toLowerCase().trim();

    setUsuarioNomeCompleto(nomeFormatado);
    setUsuarioUsername(userFormatado);
    setUsuarioEmail(formEmail);
    setUsuarioTelefone(formTelefone);
    
    localStorage.setItem('@PedeAi:nome', nomeFormatado);
    localStorage.setItem('@PedeAi:username', userFormatado);
    localStorage.setItem('@PedeAi:email', formEmail);
    localStorage.setItem('@PedeAi:telefone', formTelefone);
    localStorage.setItem('@PedeAi:tipo', tipoUsuario);

    setTelaAuth('Login');
    notify("Cadastro realizado! Faça login.");
    setFormNome(''); setFormUsername(''); setFormEmail(''); setFormTelefone(''); setFormSenha(''); setFormSenhaConfirm('');
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) {
      localStorage.removeItem('@PedeAi:estaLogado');
      setEstaLogado(false);
      setFormNome(''); setFormUsername(''); setFormEmail(''); setFormTelefone('');
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
           <CheckCircle size={18} />
           <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}

      <header className="relative bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mx-auto max-w-xl">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none">Olá, {usuarioNomeCompleto.split(' ')[0]}!</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none mt-1">PedeAí</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold">
            <MapPin size={12} /> {cidadeUsuario}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl p-5">
        {visao === 'Cliente' && (
          <Cliente 
            todasAsLojas={todasAsLojas}
            todosOsProdutos={todosOsProdutos}
            todosOsPedidos={todosOsPedidos}
            setTodosOsPedidos={setTodosOsPedidos}
            usuarioNomeCompleto={usuarioNomeCompleto}
            usuarioUsername={usuarioUsername}
            usuarioEmail={usuarioEmail}
            usuarioTelefone={usuarioTelefone}
            handleLogout={handleLogout}
            notify={notify}
            getStoreIcon={getStoreIcon}
          />
        )}
        {visao === 'Vendedor' && (
          <Vendedor 
            todosOsPedidos={todosOsPedidos}
            setTodosOsPedidos={setTodosOsPedidos}
            todosOsProdutos={todosOsProdutos}
            setTodosOsProdutos={setTodosOsProdutos}
            notify={notify}
            handleLogout={handleLogout}
            usuarioNomeCompleto={usuarioNomeCompleto}
            usuarioEmail={usuarioEmail}
          />
        )}
        {visao === 'Admin' && (
          <Admin 
            todasAsLojas={todasAsLojas}
            setTodasAsLojas={setTodasAsLojas}
            todosOsPedidos={todosOsPedidos}
            getStoreIcon={getStoreIcon}
            notify={notify}
            handleLogout={handleLogout}
            usuarioNomeCompleto={usuarioNomeCompleto}
            usuarioEmail={usuarioEmail}
          />
        )}
      </main>
    </div>
  );
}