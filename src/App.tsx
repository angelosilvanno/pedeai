import { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Pizza, UtensilsCrossed, CakeSlice, Fish, Stethoscope, Store } from 'lucide-react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'
import Cliente from './components/Cliente'
import Vendedor from './components/Vendedor'
import Admin from './components/Admin'

type Perfil = 'Cliente' | 'Vendedor' | 'Admin';

export default function App() {
  const [estaLogado, setEstaLogado] = useState(() => localStorage.getItem('@PedeAi:estaLogado') === 'true');
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState(() => localStorage.getItem('@PedeAi:nome') || '');
  const [usuarioUsername, setUsuarioUsername] = useState(() => localStorage.getItem('@PedeAi:username') || '');
  const [usuarioEmail, setUsuarioEmail] = useState(() => localStorage.getItem('@PedeAi:email') || '');
  const [tipoUsuario, setTipoUsuario] = useState<Perfil>(() => (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente');
  const [visao, setVisao] = useState<Perfil>(() => (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente');

  const [usuarioSenha, setUsuarioSenha] = useState('');
  const [usuarioSenhaConfirm, setUsuarioSenhaConfirm] = useState('');
  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([]);
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>(() => JSON.parse(localStorage.getItem('@PedeAi:produtos') || '[]'));
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>(() => JSON.parse(localStorage.getItem('@PedeAi:pedidos') || '[]'));
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (estaLogado) {
      fetch('http://localhost:3000/api/lojas')
        .then(res => res.json())
        .then(dados => setTodasAsLojas(dados))
        .catch(() => {
          notify("Servidor offline. Usando dados locais.", 'erro');
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
    if (!campoLoginIdentificacao || !campoLoginSenha) return notify("Informe login e senha.", 'erro');
    const nomeF = usuarioNomeCompleto || "Usuário PedeAí";
    localStorage.setItem('@PedeAi:estaLogado', 'true');
    localStorage.setItem('@PedeAi:nome', nomeF);
    localStorage.setItem('@PedeAi:username', campoLoginIdentificacao.toLowerCase());
    localStorage.setItem('@PedeAi:tipo', tipoUsuario);
    setEstaLogado(true);
    setVisao(tipoUsuario);
    notify(`Bem-vindo, ${nomeF.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem('@PedeAi:estaLogado');
      setEstaLogado(false);
      notify("Sessão encerrada.");
    }
  };

  const getStoreIcon = (name: string) => {
    const p = { size: 32, className: "text-orange-600" };
    switch (name) {
      case 'Pizza': return <Pizza {...p} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...p} />;
      case 'CakeSlice': return <CakeSlice {...p} />;
      case 'Fish': return <Fish {...p} />;
      case 'Stethoscope': return <Stethoscope {...p} />;
      default: return <Store {...p} />;
    }
  };

  if (!estaLogado) {
    return (
      <AuthScreen 
        telaAuth={telaAuth} setTelaAuth={setTelaAuth}
        campoLoginIdentificacao={campoLoginIdentificacao} setCampoLoginIdentificacao={setCampoLoginIdentificacao}
        campoLoginSenha={campoLoginSenha} setCampoLoginSenha={setCampoLoginSenha}
        usuarioNomeCompleto={usuarioNomeCompleto} setUsuarioNomeCompleto={setUsuarioNomeCompleto}
        usuarioUsername={usuarioUsername} setUsuarioUsername={setUsuarioUsername}
        usuarioEmail={usuarioEmail} setUsuarioEmail={setUsuarioEmail}
        usuarioSenha={usuarioSenha} setUsuarioSenha={setUsuarioSenha}
        usuarioSenhaConfirm={usuarioSenhaConfirm} setUsuarioSenhaConfirm={setUsuarioSenhaConfirm}
        tipoUsuario={tipoUsuario} setTipoUsuario={setTipoUsuario}
        nomeLoja={nomeLoja} setNomeLoja={setNomeLoja}
        handleLogin={handleLogin} handleCadastro={() => notify("Conta criada!")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl bg-zinc-900 text-white animate-in slide-in-from-top duration-300">
           <CheckCircle size={18} /> <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}
      <header className="bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mx-auto max-w-xl">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase">Olá, {usuarioNomeCompleto.split(' ')[0]}!</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none mt-1">PedeAí</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold">
            <MapPin size={12} /> Cidades Pequenas
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-xl p-5">
        {visao === 'Cliente' && <Cliente todasAsLojas={todasAsLojas} todosOsProdutos={todosOsProdutos} todosOsPedidos={todosOsPedidos} setTodosOsPedidos={setTodosOsPedidos} usuarioNomeCompleto={usuarioNomeCompleto} usuarioUsername={usuarioUsername} usuarioEmail={usuarioEmail} handleLogout={handleLogout} notify={notify} getStoreIcon={getStoreIcon} />}
        {visao === 'Vendedor' && <Vendedor todosOsPedidos={todosOsPedidos} setTodosOsPedidos={setTodosOsPedidos} todosOsProdutos={todosOsProdutos} setTodosOsProdutos={setTodosOsProdutos} notify={notify} />}
        {visao === 'Admin' && <Admin todasAsLojas={todasAsLojas} setTodasAsLojas={setTodasAsLojas} todosOsPedidos={todosOsPedidos} getStoreIcon={getStoreIcon} notify={notify} />}
      </main>
    </div>
  );
}