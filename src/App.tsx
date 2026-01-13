import { useState, useMemo } from 'react'
import { 
  Home, 
  ClipboardList, 
  User, 
  Search, 
  ShoppingBag, 
  Pizza, 
  UtensilsCrossed, 
  CakeSlice, 
  Fish, 
  Stethoscope, 
  Store, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  MapPin,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  ShoppingBasket
} from 'lucide-react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'

/**
 * --- COMPONENTE PRINCIPAL APP (VERSÃO INTEGRAL PROFISSIONAL - 500+ LINHAS) ---
 */
function App() {
  // --- 1. ESTADOS DE ACESSO (PERSISTÊNCIA COM LOCALSTORAGE) ---
  const [estaLogado, setEstaLogado] = useState(() => {
    return localStorage.getItem('@PedeAi:estaLogado') === 'true';
  });
  
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState(() => {
    return localStorage.getItem('@PedeAi:nome') || '';
  });

  const [usuarioUsername, setUsuarioUsername] = useState(() => {
    return localStorage.getItem('@PedeAi:username') || '';
  });

  const [usuarioEmail, setUsuarioEmail] = useState(() => {
    return localStorage.getItem('@PedeAi:email') || '';
  });

  const [tipoUsuario, setTipoUsuario] = useState<'Cliente' | 'Vendedor' | 'Admin'>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as 'Cliente' | 'Vendedor' | 'Admin') || 'Cliente';
  });

  const [visao, setVisao] = useState<'Cliente' | 'Vendedor' | 'Admin'>(() => {
    return (localStorage.getItem('@PedeAi:tipo') as 'Cliente' | 'Vendedor' | 'Admin') || 'Cliente';
  });

  // Campos temporários de formulário
  const [usuarioSenha, setUsuarioSenha] = useState('');
  const [usuarioSenhaConfirm, setUsuarioSenhaConfirm] = useState('');
  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  // --- ESTADOS DE NAVEGAÇÃO ---
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');
  const [busca, setBusca] = useState('');
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  // --- ESTADOS DE DADOS (INTEGRAL) ---
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([
    { id: 1, nome: "Pizzaria do João", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
    { id: 2, nome: "Hambúrguer da Vila", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
    { id: 3, nome: "Doces da Maria", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa' },
    { id: 4, nome: "Sushiman da Cidade", categoria: "Japonesa", imagem: "Fish", status: 'Ativa' },
    { id: 5, nome: "Farmácia Central", categoria: "Saúde", imagem: "Stethoscope", status: 'Pendente' },
    { id: 6, nome: "Supermercado Econômico", categoria: "Mercado", imagem: "Store", status: 'Ativa' },
  ]);

  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([
    // Cardápio da Pizzaria
    { id: 'p1', lojaId: 1, nome: "Pizza Calabresa Familiar", preco: 45.90, descricao: "Mussarela, calabresa selecionada e cebola." },
    { id: 'p2', lojaId: 1, nome: "Pizza de Frango c/ Catupiry", preco: 49.00, descricao: "Frango desfiado temperado e Catupiry legítimo." },
    { id: 'p3', lojaId: 1, nome: "Pizza Margherita", preco: 44.00, descricao: "Tomate fresco, manjericão e mussarela." },
    // Cardápio da Hamburgueria
    { id: 'h1', lojaId: 2, nome: "X-Bacon Supremo", preco: 28.50, descricao: "Pão brioche, blend 150g, muito bacon e cheddar." },
    { id: 'h2', lojaId: 2, nome: "Smash Burger Simples", preco: 19.90, descricao: "Carne smash 90g, queijo e molho especial." },
    { id: 'h3', lojaId: 2, nome: "Porção Batata G", preco: 18.00, descricao: "Batata frita rústica com alecrim e sal." },
    // Cardápio da Doceria
    { id: 'd1', lojaId: 3, nome: "Bolo de Pote Ninho", preco: 15.00, descricao: "Creme de ninho com pedaços de morango." },
    { id: 'd2', lojaId: 3, nome: "Fatia Torta Holandesa", preco: 12.50, descricao: "Creme leve e cobertura de chocolate." },
    { id: 'd3', lojaId: 3, nome: "Brigadeiro Gourmet", preco: 4.50, descricao: "Chocolate belga 50% cacau." },
    // Cardápio Japonês
    { id: 'j1', lojaId: 4, nome: "Combinado 15 peças", preco: 55.00, descricao: "Sashimis, hossomakis e uramakis variados." },
    { id: 'j2', lojaId: 4, nome: "Temaki Salmão Completo", preco: 29.90, descricao: "Salmão fresco, cream cheese e cebolinha." },
  ]);

  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>([]);
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  // --- FUNÇÕES DE FEEDBACK ---
  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * --- FUNÇÕES DE LÓGICA DO SISTEMA ---
   */

  const handleLogin = () => {
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      notify("Por favor, informe seu login e sua senha.", 'erro');
      return;
    }
    const nomeFinal = usuarioNomeCompleto || "Angelo Silvano";
    const userFinal = usuarioUsername || campoLoginIdentificacao.toLowerCase();

    localStorage.setItem('@PedeAi:estaLogado', 'true');
    localStorage.setItem('@PedeAi:nome', nomeFinal);
    localStorage.setItem('@PedeAi:username', userFinal);
    localStorage.setItem('@PedeAi:tipo', tipoUsuario);

    setUsuarioNomeCompleto(nomeFinal);
    setVisao(tipoUsuario); 
    setEstaLogado(true);
    notify(`Bem-vindo, ${nomeFinal.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setEstaLogado(false);
    setVisao('Cliente');
    setAbaAtiva('Inicio');
    notify("Você saiu da conta.");
  };

  const handleCadastro = () => {
    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      notify("Preencha todos os campos obrigatórios.", 'erro');
      return;
    }
    if (usuarioSenha !== usuarioSenhaConfirm) {
      notify("As senhas não coincidem!", 'erro');
      return;
    }

    const nomeFormatado = usuarioNomeCompleto.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    setUsuarioNomeCompleto(nomeFormatado);
    setTelaAuth('Login');
    notify("Cadastro realizado com sucesso!");
  };

  const realizarPedidoFinal = () => {
    if (!enderecoEntrega) {
      notify("O endereço de entrega é obrigatório.", 'erro');
      return;
    }
    const novoPedido: Pedido = {
      id: crypto.randomUUID(),
      lojaNome: lojaSelecionada?.nome || 'Estabelecimento PedeAí',
      clienteNome: usuarioNomeCompleto,
      clienteUsername: usuarioUsername,
      itens: [...carrinho],
      total: carrinho.reduce((acc, item) => acc + item.preco, 0),
      endereco: enderecoEntrega,
      pagamento: formaPagamento,
      status: 'Pendente'
    };
    setTodosOsPedidos([novoPedido, ...todosOsPedidos]);
    setCarrinho([]);
    setEstaFinalizando(false);
    setLojaSelecionada(null);
    setAbaAtiva('Pedidos');
    notify("Pedido enviado com sucesso!");
  };

  const mudarStatusPedidoVendedor = (id: string, novoStatus: Pedido['status']) => {
    setTodosOsPedidos(todosOsPedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
    notify(`Pedido atualizado para: ${novoStatus}`);
  };

  const removerProdutoVendedor = (id: string) => {
    setTodosOsProdutos(todosOsProdutos.filter(p => p.id !== id));
    notify("Produto removido do cardápio.");
  };

  const gerenciarLojaAdmin = (id: number, acao: 'Aprovar' | 'Bloquear') => {
    setTodasAsLojas(todasAsLojas.map(l => {
      if (l.id === id) {
        return { ...l, status: acao === 'Aprovar' ? 'Ativa' : 'Bloqueada' };
      }
      return l;
    }));
    notify(`Estabelecimento ${acao === 'Aprovar' ? 'ativado' : 'bloqueado'}.`);
  };

  const cadastrarNovoProdutoVendedor = () => {
    const nome = prompt("Nome do novo item:");
    const preco = prompt("Preço (Ex: 29.90):");
    if (nome && preco) {
      const novoProduto: Produto = {
        id: crypto.randomUUID(),
        lojaId: 1, 
        nome,
        preco: parseFloat(preco.replace(',', '.')),
        descricao: "Produto adicionado pelo lojista."
      };
      setTodosOsProdutos([...todosOsProdutos, novoProduto]);
      notify("Novo item adicionado!");
    }
  };

  // --- LÓGICA DE DERIVAÇÃO DE DADOS ---
  const lojasFiltradas = useMemo(() => {
    return todasAsLojas.filter(l => 
      l.status === 'Ativa' && 
      l.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, todasAsLojas]);

  const cardapioParaExibir = useMemo(() => {
    return todosOsProdutos.filter(p => p.lojaId === lojaSelecionada?.id);
  }, [lojaSelecionada, todosOsProdutos]);

  const getStoreIcon = (iconName: string) => {
    const iconProps = { size: 32, className: "text-orange-600" };
    switch (iconName) {
      case 'Pizza': return <Pizza {...iconProps} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...iconProps} />;
      case 'CakeSlice': return <CakeSlice {...iconProps} />;
      case 'Fish': return <Fish {...iconProps} />;
      case 'Stethoscope': return <Stethoscope {...iconProps} />;
      case 'Store': return <Store {...iconProps} />;
      default: return <ShoppingBasket {...iconProps} />;
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
        handleLogin={handleLogin} handleCadastro={handleCadastro}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans selection:bg-orange-200">
      
      {/* TOAST FEEDBACK PROFISSIONAL */}
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-top duration-300 ${toast.tipo === 'sucesso' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'}`}>
           <CheckCircle size={18} />
           <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}

      {/* SELETOR DE VISÕES (DEBUG) */}
      <div className="sticky top-0 z-50 flex justify-center gap-6 bg-zinc-950 p-2 text-[9px] text-white shadow-2xl">
        <button onClick={() => setVisao('Cliente')} className={visao === 'Cliente' ? 'border-b border-orange-400 pb-1 font-black text-orange-400' : 'opacity-30'}>VISÃO CLIENTE</button>
        <button onClick={() => setVisao('Vendedor')} className={visao === 'Vendedor' ? 'border-b border-orange-400 font-black text-orange-400' : 'opacity-30'}>VISÃO VENDEDOR</button>
        <button onClick={() => tipoUsuario === 'Admin' ? setVisao('Admin') : notify("Acesso negado.", 'erro')} className={visao === 'Admin' ? 'border-b border-orange-400 font-black text-orange-400' : 'opacity-30'}>VISÃO ADMIN</button>
      </div>

      {/* NOVO HEADER REFINADO */}
      <header className="relative bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Olá, {usuarioNomeCompleto.split(' ')[0]}!</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">PedeAí</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold">
            <MapPin size={12} /> Cidades Pequenas
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl p-5">
        
        {visao === 'Cliente' && (
          abaAtiva === 'Inicio' ? (
            estaFinalizando ? (
              /* TELA DE CHECKOUT */
              <div className="space-y-6 animate-in slide-in-from-right duration-400">
                <button onClick={() => setEstaFinalizando(false)} className="flex items-center gap-2 font-bold text-orange-600 text-sm">
                  <ArrowLeft size={16} /> Voltar para a sacola
                </button>
                <div className="space-y-6 rounded-[40px] border border-zinc-100 bg-white p-10 shadow-sm">
                  <h2 className="text-xl font-black text-zinc-800">Finalizar pedido</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">Endereço de Entrega</label>
                      <input 
                        type="text" placeholder="Rua, número e bairro" 
                        className="w-full rounded-3xl bg-zinc-50 p-5 font-medium outline-none focus:ring-4 ring-orange-100" 
                        value={enderecoEntrega} onChange={(e) => setEnderecoEntrega(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-2">Forma de Pagamento</label>
                      <select 
                        className="w-full rounded-3xl bg-zinc-50 p-5 font-bold outline-none ring-orange-100 focus:ring-4 appearance-none" 
                        value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}
                      >
                        <option value="Dinheiro">Dinheiro na entrega</option>
                        <option value="Pix">Pix Instantâneo</option>
                        <option value="Cartão">Cartão na entrega</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-zinc-50 pt-6">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Total</span>
                    <p className="text-3xl font-black italic text-green-600 tracking-tighter">R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}</p>
                  </div>
                  <button onClick={realizarPedidoFinal} className="w-full rounded-3xl bg-orange-600 p-6 text-xl font-black text-white shadow-lg active:scale-95 transition-all">Confirmar Agora!</button>
                </div>
              </div>
            ) : !lojaSelecionada ? (
              /* LISTAGEM DE ESTABELECIMENTOS */
              <div className="space-y-8">
                <div className="relative">
                   <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                   <input 
                    type="text" placeholder="O que vamos pedir hoje?" 
                    className="w-full rounded-[30px] border border-zinc-100 bg-white py-6 pl-16 pr-8 font-bold shadow-sm outline-none focus:ring-4 ring-orange-50 transition-all"
                    value={busca} onChange={(e) => setBusca(e.target.value)}
                   />
                </div>
                <h2 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase ml-2">Estabelecimentos Próximos</h2>
                <div className="grid grid-cols-1 gap-5">
                  {lojasFiltradas.map((loja: Loja) => (
                    <div 
                      key={loja.id} onClick={() => setLojaSelecionada(loja)} 
                      className="group flex cursor-pointer items-center rounded-[35px] border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 shadow-inner group-hover:scale-105 transition-transform">
                        {getStoreIcon(loja.imagem)}
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-zinc-800 tracking-tight leading-none">{loja.nome}</h3>
                          <ChevronRight size={16} className="text-zinc-300" />
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{loja.categoria}</p>
                        <div className="flex items-center gap-3 mt-3">
                           <span className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                              <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" /> ABERTO
                           </span>
                           <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase">
                              <Clock size={10} /> 30-45 MIN
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* VISUALIZAÇÃO DO CARDÁPIO */
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-bold text-orange-600 text-sm"><ArrowLeft size={16} /> Ver outras lojas</button>
                <div className="flex items-center gap-6">
                   <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">{getStoreIcon(lojaSelecionada.imagem)}</div>
                   <div>
                      <h2 className="text-3xl font-black text-zinc-800 tracking-tighter leading-none">{lojaSelecionada.nome}</h2>
                      <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">{lojaSelecionada.categoria}</p>
                   </div>
                </div>
                <div className="space-y-4">
                  {cardapioParaExibir.map((item: Produto) => (
                    <div key={item.id} className="flex items-center justify-between gap-5 rounded-[35px] border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-zinc-800 tracking-tight">{item.nome}</h4>
                        <p className="my-1 text-xs font-medium text-zinc-400 leading-relaxed">{item.descricao}</p>
                        <p className="mt-1 text-lg font-black text-green-600 tracking-tighter">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => { setCarrinho([...carrinho, item]); notify(`${item.nome} adicionado!`); }} 
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg active:scale-90 transition-all"
                      ><Plus size={24} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : abaAtiva === 'Pedidos' ? (
            /* LISTA DE PEDIDOS */
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Meus pedidos</h2>
              {todosOsPedidos.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 mb-6">
                    <ClipboardList size={40} className="text-zinc-300" />
                  </div>
                  <p className="text-lg font-black text-zinc-800 uppercase">Nenhum pedido</p>
                  <p className="text-xs text-zinc-400 mt-1 uppercase">Escolha algo gostoso agora!</p>
                </div>
              ) : (
                todosOsPedidos.map((p: Pedido) => (
                  <div key={p.id} className="rounded-[40px] border border-zinc-100 bg-white p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-zinc-800 tracking-tight">{p.lojaNome}</h3>
                        <p className="text-[10px] font-mono font-bold text-zinc-300">#{p.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-500' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{p.status}</span>
                    </div>
                    <div className="bg-zinc-50 rounded-2xl p-4 text-xs font-medium text-zinc-500 border border-zinc-100">{p.itens.map(i => i.nome).join(', ')}</div>
                    <div className="mt-4 pt-4 border-t border-zinc-50 flex justify-between items-center">
                       <p className="text-2xl font-black text-zinc-800 italic tracking-tighter">R$ {p.total.toFixed(2)}</p>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{p.pagamento}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* PERFIL */
            <div className="space-y-10 animate-in fade-in">
              <h2 className="text-center text-2xl font-black text-zinc-800">Minha Conta</h2>
              <div className="rounded-[55px] border border-zinc-100 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[45px] bg-orange-100 text-orange-600 shadow-xl border-8 border-white">
                  <User size={60} />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-black">{usuarioNomeCompleto}</h3>
                  <p className="text-sm font-bold text-zinc-400">@{usuarioUsername}</p>
                </div>
                <div className="mt-10 space-y-4">
                  <button className="w-full rounded-[30px] bg-zinc-50 p-6 text-sm font-black text-zinc-600 flex justify-between px-8">Endereços Salvos <ChevronRight size={18} /></button>
                  <button onClick={handleLogout} className="w-full rounded-[30px] border-2 border-red-50 p-6 text-xs font-black text-red-500 uppercase tracking-widest">Sair da Conta</button>
                </div>
              </div>
            </div>
          )
        )}

        {visao === 'Vendedor' && (
          /* ÁREA DO VENDEDOR */
          <div className="space-y-8 animate-in slide-in-from-bottom">
            <div className="flex bg-zinc-200 p-2 rounded-[30px] shadow-inner">
              <button onClick={() => setAbaVendedor('Pedidos')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Pedidos' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>PAINEL VENDAS</button>
              <button onClick={() => setAbaVendedor('Cardapio')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Cardapio' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>MEU CARDÁPIO</button>
            </div>
            {abaVendedor === 'Pedidos' ? (
              todosOsPedidos.length === 0 ? <p className="py-20 text-center font-bold text-zinc-300 uppercase">Sem novos pedidos.</p> :
              todosOsPedidos.map((p: Pedido) => (
                <div key={p.id} className="bg-white p-8 rounded-[45px] border-l-12 border-orange-500 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black">{p.clienteNome}</h3>
                    <span className="text-[10px] font-black text-zinc-400 uppercase">{p.status}</span>
                  </div>
                  <div className="bg-zinc-50 p-5 rounded-3xl font-bold italic text-zinc-500 text-sm border border-zinc-100">{p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}</div>
                  <p className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase"><MapPin size={14} /> {p.endereco}</p>
                  <div className="flex gap-2">
                    <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Preparando')} className="flex-1 bg-green-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase">Aceitar</button>
                    <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Entregue')} className="flex-1 bg-zinc-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase">Concluir</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-8">
                <button onClick={cadastrarNovoProdutoVendedor} className="w-full bg-orange-600 text-white py-8 rounded-[35px] font-black uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Plus size={24} /> Adicionar Produto</button>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-zinc-400 uppercase ml-2 tracking-widest">Produtos Atuais</h3>
                  {todosOsProdutos.filter(p => p.lojaId === 1).map((p: Produto) => (
                    <div key={p.id} className="bg-white p-6 rounded-[35px] border border-zinc-100 flex justify-between items-center shadow-sm hover:border-orange-200 transition-all">
                      <div>
                        <h4 className="font-black text-zinc-800">{p.nome}</h4>
                        <p className="font-black text-green-600 text-sm italic">R$ {p.preco.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removerProdutoVendedor(p.id)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {visao === 'Admin' && (
          /* ÁREA DO ADMINISTRADOR */
          <div className="space-y-10 animate-in slide-in-from-top">
            <h2 className="text-center text-2xl font-black text-zinc-800 uppercase italic tracking-tighter">PedeAí Admin Platform</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-3">Faturamento Global</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
              </div>
              <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-3">Parceiros Ativos</p>
                <p className="text-3xl font-black text-orange-600">{todasAsLojas.filter(l => l.status === 'Ativa').length}</p>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase ml-2 tracking-widest">Controle de Estabelecimentos</h3>
              {todasAsLojas.map((loja: Loja) => (
                <div key={loja.id} className="bg-white p-6 rounded-[40px] border border-zinc-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-zinc-50 rounded-2xl flex items-center justify-center shadow-inner">{getStoreIcon(loja.imagem)}</div>
                    <div>
                      <h4 className="font-black text-zinc-800 tracking-tight leading-none mb-1">{loja.nome}</h4>
                      <p className={`text-[9px] font-black uppercase ${loja.status === 'Ativa' ? 'text-green-500' : 'text-red-400'}`}>{loja.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {loja.status === 'Ativa' ? (
                       <button onClick={() => gerenciarLojaAdmin(loja.id, 'Bloquear')} className="px-5 py-3 rounded-2xl bg-red-50 text-red-500 font-black text-[9px] uppercase"><Lock size={12} /></button>
                    ) : (
                       <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="px-6 py-3 rounded-2xl bg-zinc-900 text-white font-black text-[9px] uppercase tracking-widest">Ativar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR PROFISSIONAL (LUCIDE ICONS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button 
          onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); }} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Bora</span>
        </button>
        <button 
          onClick={() => setAbaAtiva('Pedidos')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <ClipboardList size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span>
        </button>
        <button 
          onClick={() => setAbaAtiva('Perfil')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Perfil' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Eu</span>
        </button>
      </nav>

      {/* CARRINHO FLUTUANTE PROFISSIONAL */}
      {visao === 'Cliente' && abaAtiva === 'Inicio' && carrinho.length > 0 && !estaFinalizando && (
        <div className="fixed bottom-32 left-6 right-6 z-40 mx-auto max-w-md animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="w-full bg-zinc-900 text-white p-7 rounded-[35px] font-black shadow-2xl flex justify-between items-center ring-4 ring-white active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={24} />
               </div>
               <div className="text-left">
                  <p className="text-[10px] opacity-60 uppercase font-bold leading-none">Ver sacola</p>
                  <p className="text-base uppercase leading-none mt-1">{carrinho.length} itens no carrinho</p>
               </div>
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-orange-400">R$ {carrinho.reduce((s, i) => s + i.preco, 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;