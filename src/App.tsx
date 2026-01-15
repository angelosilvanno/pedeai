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
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([]);
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:pedidos');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const alternarTelaAuth = (tela: 'Login' | 'Cadastro') => {
    setTelaAuth(tela);
    setFormNome(''); setFormUsername(''); setFormEmail(''); setFormTelefone(''); setFormSenha(''); setFormSenhaConfirm('');
  };

  useEffect(() => {
    const buscarLocalizacaoReal = async () => {
      try {
        const resposta = await fetch('https://ipapi.co/json/');
        const dados = await resposta.json();
        if (dados.city) setCidadeUsuario(`${dados.city}, ${dados.region_code}`);
      } catch { setCidadeUsuario("Brasil"); }
    };
    buscarLocalizacaoReal();
  }, []);

  useEffect(() => {
    if (estaLogado) {
      const carregarDadosDoServidor = async () => {
        try {
          const resLojas = await fetch('http://localhost:3000/api/lojas');
          const resProdutos = await fetch('http://localhost:3000/api/produtos');
          if (resLojas.ok && resProdutos.ok) {
            setTodasAsLojas(await resLojas.json());
            setTodosOsProdutos(await resProdutos.json());
          }
        } catch {
          setTodasAsLojas([
            { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
            { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
          ]);
        }
      };
      carregarDadosDoServidor();
    }
  }, [estaLogado]);

  useEffect(() => { localStorage.setItem('@PedeAi:pedidos', JSON.stringify(todosOsPedidos)); }, [todosOsPedidos]);

  const handleLogin = async () => {
    const iden = formUsername || formEmail;
    if (!iden || !formSenha) return notify("Informe login e senha.", 'erro');
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacao: iden, senha: formSenha })
      });
      if (res.ok) {
        const dados = await res.json();
        setUsuarioNomeCompleto(dados.nome);
        setUsuarioUsername(dados.username);
        setUsuarioEmail(dados.email);
        setUsuarioTelefone(dados.telefone);
        setTipoUsuario(dados.tipo);
        setVisao(dados.tipo);
        setEstaLogado(true);
        localStorage.setItem('@PedeAi:estaLogado', 'true');
        localStorage.setItem('@PedeAi:nome', dados.nome);
        localStorage.setItem('@PedeAi:username', dados.username);
        localStorage.setItem('@PedeAi:email', dados.email);
        localStorage.setItem('@PedeAi:telefone', dados.telefone);
        localStorage.setItem('@PedeAi:tipo', dados.tipo);
        setFormSenha('');
      } else { notify("Usuário ou senha incorretos.", 'erro'); }
    } catch { notify("Servidor offline.", 'erro'); }
  };

  const handleCadastro = async () => {
    if (!formNome || !formUsername || !formEmail || !formSenha) return notify("Preencha todos os campos.", 'erro');
    if (tipoUsuario !== 'Admin' && !formTelefone) return notify("Telefone obrigatório.", 'erro');
    if (formSenha !== formSenhaConfirm) return notify("Senhas não coincidem!", 'erro');
    const nomeF = formNome.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    try {
      const res = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeF, username: formUsername.toLowerCase().trim(), email: formEmail.toLowerCase(), telefone: formTelefone, senha: formSenha, tipo: tipoUsuario })
      });
      if (res.ok) {
        notify("Sucesso! Faça login.");
        setTelaAuth('Login');
        setFormSenha(''); setFormSenhaConfirm('');
      } else {
        const dadosErro = await res.json();
        notify(dadosErro.mensagem, 'erro');
      }
    } catch { notify("Erro no servidor.", 'erro'); }
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) {
      localStorage.clear();
      setEstaLogado(false);
      setFormNome(''); setFormUsername(''); setFormEmail(''); setFormSenha('');
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

  return (
    /* CORREÇÃO: pb-40 no contêiner pai garante que o conteúdo não fique "preso" sob o menu fixo */
    <div className={`min-h-screen w-full font-sans selection:bg-orange-200 transition-colors duration-500 pb-40 ${!estaLogado ? 'bg-orange-600' : 'bg-zinc-50'}`}>
      
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl bg-zinc-900 text-white animate-in slide-in-from-top duration-300`}>
           <CheckCircle size={18} />
           <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}

      {!estaLogado ? (
        <AuthScreen 
          telaAuth={telaAuth} setTelaAuth={alternarTelaAuth}
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
      ) : (
        <div className="w-full">
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
                todosOsPedidos={todosOsPedidos} setTodosOsPedidos={setTodosOsPedidos}
                todosOsProdutos={todosOsProdutos} setTodosOsProdutos={setTodosOsProdutos}
                notify={notify} handleLogout={handleLogout}
                usuarioNomeCompleto={usuarioNomeCompleto} usuarioEmail={usuarioEmail}
              />
            )}
            {visao === 'Admin' && (
              <Admin 
                todasAsLojas={todasAsLojas} setTodasAsLojas={setTodasAsLojas}
                todosOsPedidos={todosOsPedidos} getStoreIcon={getStoreIcon}
                notify={notify} handleLogout={handleLogout}
                usuarioNomeCompleto={usuarioNomeCompleto} usuarioEmail={usuarioEmail}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}