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
  const [estaLogado, setEstaLogado] = useState(() => {
    return localStorage.getItem('@PedeAi:estaLogado') === 'true';
  });

  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState(() => {
    return localStorage.getItem('@PedeAi:nome') || '';
  });

  const [usuarioUsername, setUsuarioUsername] = useState(() => {
    return localStorage.getItem('@PedeAi:username') || '';
  });

  const [usuarioEmail, setUsuarioEmail] = useState(() => {
    return localStorage.getItem('@PedeAi:email') || '';
  });

  const [usuarioTelefone, setUsuarioTelefone] = useState(() => {
    return localStorage.getItem('@PedeAi:telefone') || '';
  });
  
  const [tipoUsuario, setTipoUsuario] = useState<Perfil>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente';
  });

  const [visao, setVisao] = useState<Perfil>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as Perfil) || 'Cliente';
  });

  const [cidadeUsuario, setCidadeUsuario] = useState('Localizando...');
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro' | 'Recuperar'>('Login');
  
  const [formNome, setFormNome] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formSenha, setFormSenha] = useState('');
  const [formSenhaConfirm, setFormSenhaConfirm] = useState('');
  const [formNomeLoja, setFormNomeLoja] = useState('');

  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([]);
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([]);
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>([]);

  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const limparFormulario = () => {
    setFormNome('');
    setFormUsername('');
    setFormEmail('');
    setFormTelefone('');
    setFormSenha('');
    setFormSenhaConfirm('');
    setFormNomeLoja('');
  };

  const alternarTelaAuth = (tela: 'Login' | 'Cadastro' | 'Recuperar') => {
    setTelaAuth(tela);
    limparFormulario();
  };

  useEffect(() => {
    const buscarLocalizacaoReal = async () => {
      try {
        const resposta = await fetch('http://ip-api.com/json/');
        const dados = await resposta.json();
        if (dados.city) {
          setCidadeUsuario(`${dados.city}, ${dados.region}`);
        }
      } catch {
        setCidadeUsuario("Brasil");
      }
    };
    buscarLocalizacaoReal();
  }, []);

  useEffect(() => {
    if (estaLogado) {
      const carregarDadosDoServidor = async () => {
        try {
          const [resLojas, resProdutos, resPedidos] = await Promise.all([
            fetch('http://localhost:3000/api/lojas'),
            fetch('http://localhost:3000/api/produtos'),
            fetch('http://localhost:3000/api/pedidos')
          ]);
          
          if (resLojas.ok) {
            const lojasJson = await resLojas.json();
            const lojasFormatadas = lojasJson.map((l: Loja) => ({
              ...l,
              id: Number(l.id)
            }));
            setTodasAsLojas(lojasFormatadas);
          }

          if (resProdutos.ok) {
            const produtosJson = await resProdutos.json();
            const produtosAjustados = produtosJson.map((p: Produto) => ({
              ...p,
              id: Number(p.id),
              lojaId: Number(p.lojaId)
            }));
            setTodosOsProdutos(produtosAjustados);
          }

          if (resPedidos.ok) setTodosOsPedidos(await resPedidos.json());
          
        } catch {
          setTodasAsLojas([
            { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa', email: "pizzariaoliveira26@gmail.com" },
            { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa', email: "mari@burger.com" },
          ]);
        }
      };
      carregarDadosDoServidor();
    }
  }, [estaLogado]);

  const atualizarPedidosNoServidor = async (novoPedido: Pedido) => {
    try {
      const respostaPost = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPedido)
      });
      
      if (respostaPost.ok) {
        setTodosOsPedidos(prev => [novoPedido, ...prev]);
      } else {
        notify("Erro ao salvar pedido no servidor.", "erro");
      }
    } catch {
      notify("Servidor offline. Pedido não sincronizado.", "erro");
    }
  };

  const handleLogin = async () => {
    const iden = formUsername || formEmail;
    if (!iden || !formSenha) {
      notify("Informe login e senha.", 'erro');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacao: iden, senha: formSenha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
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
        
        limparFormulario();
        notify(`Bem-vindo, ${dados.nome.split(' ')[0]}!`);
      } else {
        notify("Usuário ou senha incorretos.", 'erro');
      }
    } catch {
      notify("Servidor offline.", 'erro');
    }
  };

  const handleCadastro = async () => {
    if (!formNome || !formUsername || !formEmail || !formSenha) {
      notify("Preencha todos os campos.", 'erro');
      return;
    }
    if (tipoUsuario !== 'Admin' && !formTelefone) {
      notify("Telefone obrigatório.", 'erro');
      return;
    }
    if (formSenha !== formSenhaConfirm) {
      notify("Senhas não coincidem!", 'erro');
      return;
    }

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
        notify("Sucesso! Faça login.");
        setTelaAuth('Login');
        limparFormulario();
      } else {
        const dadosErro = await resposta.json();
        notify(dadosErro.mensagem, 'erro');
      }
    } catch {
      notify("Erro no servidor.", 'erro');
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) {
      localStorage.clear();
      setEstaLogado(false);
      limparFormulario();
      setTodosOsPedidos([]);
      notify("Sessão encerrada.");
    }
  };

  const mudarStatusPedidoVendedor = async (pedidoId: string, novoStatus: Pedido['status']) => {
    try {
      const resposta = await fetch('http://localhost:3000/api/pedidos/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId, novoStatus })
      });

      if (resposta.ok) {
        setTodosOsPedidos(prev => 
          prev.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p)
        );
        notify(`Pedido ${novoStatus === 'Entregue' ? 'finalizado' : 'atualizado'}!`);
      } else {
        const erro = await resposta.json();
        notify(erro.msg || "Erro ao atualizar pedido.", 'erro');
      }
    } catch {
      notify("Conexão com o servidor falhou.", 'erro');
    }
  };

  const handleNovoPedidoCliente = (novoPedido: Pedido) => {
    atualizarPedidosNoServidor(novoPedido);
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
    <div className={`min-h-screen w-full font-sans selection:bg-orange-200 transition-colors duration-500 scrollbar-hide ${!estaLogado ? 'bg-orange-600 overflow-hidden' : 'bg-zinc-50 pb-40'}`}>
      
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl bg-zinc-900 text-white animate-in slide-in-from-top duration-300">
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
          <header className="sticky top-0 z-50 bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
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
                setTodosOsPedidos={(novo: Pedido[] | ((prev: Pedido[]) => Pedido[])) => {
                  if (typeof novo === 'function') {
                    const listaAtualizada = novo(todosOsPedidos);
                    const ultimoPedido = listaAtualizada[0];
                    handleNovoPedidoCliente(ultimoPedido);
                  }
                }}
                usuarioNomeCompleto={usuarioNomeCompleto} usuarioUsername={usuarioUsername}
                usuarioEmail={usuarioEmail} usuarioTelefone={usuarioTelefone}
                handleLogout={handleLogout} notify={notify} getStoreIcon={getStoreIcon}
              />
            )}
            {visao === 'Vendedor' && (
              <Vendedor 
                todosOsPedidos={todosOsPedidos}
                todosOsProdutos={todosOsProdutos}
                setTodosOsProdutos={setTodosOsProdutos}
                todasAsLojas={todasAsLojas}
                notify={notify}
                handleLogout={handleLogout}
                usuarioNomeCompleto={usuarioNomeCompleto}
                usuarioEmail={usuarioEmail}
                mudarStatusPedidoVendedor={mudarStatusPedidoVendedor}
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
      )}
    </div>
  );
}