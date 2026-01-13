import { useState, useMemo, useEffect } from 'react'
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
  ShoppingBasket,
  LogOut
} from 'lucide-react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'

/**
 * --- COMPONENTE PRINCIPAL APP ---
 * Versão Integral Absoluta: Sem cortes, Persistência LocalStorage Total e UI Profissional.
 */
function App() {
  // --- 1. ESTADOS DE ACESSO E SEGURANÇA (PERSISTÊNCIA) ---
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

  // Campos temporários de formulário (não persistem no F5)
  const [usuarioSenha, setUsuarioSenha] = useState('');
  const [usuarioSenhaConfirm, setUsuarioSenhaConfirm] = useState('');
  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  // --- 2. ESTADOS DE NAVEGAÇÃO E INTERFACE ---
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');
  const [busca, setBusca] = useState('');
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null);

  // --- 3. ESTADOS DE DADOS (COM SINCRONIZAÇÃO LOCALSTORAGE) ---
  
  // Lista de Estabelecimentos
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:lojas');
    return salvo ? JSON.parse(salvo) : [
      { id: 1, nome: "Pizzaria Oliveira", categoria: "Pizzas", imagem: "Pizza", status: 'Ativa' },
      { id: 2, nome: "Burger da Mari", categoria: "Lanches", imagem: "UtensilsCrossed", status: 'Ativa' },
      { id: 3, nome: "Doçuras da Ana", categoria: "Doceria", imagem: "CakeSlice", status: 'Ativa' },
      { id: 4, nome: "Tanaka Sushi", categoria: "Japonesa", imagem: "Fish", status: 'Ativa' },
      { id: 5, nome: "Farmácia São Lucas", categoria: "Saúde", imagem: "Stethoscope", status: 'Pendente' },
      { id: 6, nome: "Mercado do Sr. Zé", categoria: "Mercado", imagem: "Store", status: 'Ativa' },
    ];
  });

  // Lista de Todos os Produtos
  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:produtos');
    return salvo ? JSON.parse(salvo) : [
      // Pizzaria Oliveira
      { id: 'p1', lojaId: 1, nome: "Margherita Especial", preco: 48.90, descricao: "Molho artesanal, muçarela premium, tomate cereja e manjericão fresco." },
      { id: 'p2', lojaId: 1, nome: "Calabresa com Cebola Roxa", preco: 45.00, descricao: "Calabresa defumada, cebola roxa caramelizada e azeitonas pretas." },
      { id: 'p3', lojaId: 1, nome: "Frango com Catupiry Real", preco: 52.00, descricao: "Peito de frango desfiado com tempero da casa e Catupiry legítimo." },
      // Burger da Mari
      { id: 'h1', lojaId: 2, nome: "Smash Mari Clássico", preco: 26.50, descricao: "Dois blends de 90g, cheddar derretido e molho secreto no pão brioche." },
      { id: 'h2', lojaId: 2, nome: "Bacon Supreme", preco: 32.90, descricao: "Carne 160g grelhada, bacon crocante, maionese defumada e picles." },
      { id: 'h3', lojaId: 2, nome: "Veggie Delight", preco: 29.00, descricao: "Hambúrguer de grão-de-bico, rúcula e geleia de pimenta no pão australiano." },
      // Doçuras da Ana
      { id: 'd1', lojaId: 3, nome: "Ninho com Nutella", preco: 18.00, descricao: "Camadas generosas de creme de leite Ninho e cobertura de Nutella pura." },
      { id: 'd2', lojaId: 3, nome: "Fatia Torta Holandesa", preco: 15.50, descricao: "Base crocante de biscoito, creme de baunilha e ganache meio amargo." },
      { id: 'd3', lojaId: 3, nome: "Brigadeiro de Pistache", preco: 6.50, descricao: "Brigadeiro gourmet com pistache triturado e chocolate belga branco." },
      // Tanaka Sushi
      { id: 'j1', lojaId: 4, nome: "Combinado Premium (15pçs)", preco: 65.00, descricao: "5 Sashimis, 5 Uramakis Philadelphia e 5 Hossomakis de Kani." },
      { id: 'j2', lojaId: 4, nome: "Temaki Salmão Completo", preco: 34.90, descricao: "Salmão fresco em cubos, cream cheese e cebolinha crocante." },
      { id: 'j3', lojaId: 4, nome: "Hot Roll Especial", preco: 28.00, descricao: "Salmão empanado frito com molho tarê e gergelim tostado." },
    ];
  });

  // Histórico de Pedidos
  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>(() => {
    const salvo = localStorage.getItem('@PedeAi:pedidos');
    return salvo ? JSON.parse(salvo) : [];
  });

  // Estados de Compra
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  // --- 4. EFEITOS DE PERSISTÊNCIA (AUTO-SAVE) ---
  useEffect(() => {
    localStorage.setItem('@PedeAi:lojas', JSON.stringify(todasAsLojas));
  }, [todasAsLojas]);

  useEffect(() => {
    localStorage.setItem('@PedeAi:produtos', JSON.stringify(todosOsProdutos));
  }, [todosOsProdutos]);

  useEffect(() => {
    localStorage.setItem('@PedeAi:pedidos', JSON.stringify(todosOsPedidos));
  }, [todosOsPedidos]);

  // --- 5. FUNÇÕES DE FEEDBACK E SUPORTE ---
  const notify = (mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      notify("Por favor, informe seu login e sua senha.", 'erro');
      return;
    }
    const nomeFinal = usuarioNomeCompleto || "Angelo Silvano";
    const userFinal = usuarioUsername || campoLoginIdentificacao.toLowerCase();
    const emailFinal = usuarioEmail || "contato@pedeai.com";

    localStorage.setItem('@PedeAi:estaLogado', 'true');
    localStorage.setItem('@PedeAi:nome', nomeFinal);
    localStorage.setItem('@PedeAi:username', userFinal);
    localStorage.setItem('@PedeAi:email', emailFinal);
    localStorage.setItem('@PedeAi:tipo', tipoUsuario);

    setUsuarioNomeCompleto(nomeFinal);
    setUsuarioUsername(userFinal);
    setUsuarioEmail(emailFinal);
    setVisao(tipoUsuario); 
    setEstaLogado(true);
    notify(`Bem-vindo, ${nomeFinal.split(' ')[0]}!`);
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair da conta?")) {
      localStorage.removeItem('@PedeAi:estaLogado');
      setEstaLogado(false);
      setVisao('Cliente');
      setAbaAtiva('Inicio');
      notify("Você saiu da conta.");
    }
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

  // --- 6. FUNÇÕES DE NEGÓCIO E GERENCIAMENTO ---
  const realizarPedidoFinal = () => {
    if (!enderecoEntrega) {
      notify("O endereço de entrega é fundamental!", 'erro');
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
    notify(`Status atualizado para: ${novoStatus}`);
  };

  const removerProdutoVendedor = (id: string) => {
    if (confirm("Remover este item do cardápio?")) {
      setTodosOsProdutos(todosOsProdutos.filter(p => p.id !== id));
      notify("Produto removido.");
    }
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
        descricao: "Produto adicionado via Painel do Vendedor."
      };
      setTodosOsProdutos([...todosOsProdutos, novoProduto]);
      notify("Novo item adicionado!");
    }
  };

  // --- 7. LÓGICA DE DERIVAÇÃO DE DADOS (MEMO) ---
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

  // --- 8. RENDERIZAÇÃO DA TELA DE AUTENTICAÇÃO ---
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

  // --- 9. RENDERIZAÇÃO DA INTERFACE PRINCIPAL ---
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans selection:bg-orange-200">
      
      {/* TOAST FEEDBACK PROFISSIONAL */}
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-top duration-300 ${toast.tipo === 'sucesso' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'}`}>
           <CheckCircle size={18} />
           <span className="text-sm font-bold">{toast.mensagem}</span>
        </div>
      )}

      {/* HEADER REFINADO */}
      <header className="relative bg-linear-to-br from-orange-600 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none">Olá, {usuarioNomeCompleto.split(' ')[0]}!</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none mt-1">PedeAí</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-full text-[10px] font-bold">
            <MapPin size={12} /> Cidades Pequenas
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl p-5">
        
        {visao === 'Cliente' && (
          /* --- ÁREA DO CLIENTE --- */
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
                        className="w-full rounded-3xl bg-zinc-50 p-5 font-bold outline-none appearance-none" 
                        value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}
                      >
                        <option value="Dinheiro">Dinheiro na entrega</option>
                        <option value="Pix">Pix Instantâneo</option>
                        <option value="Cartão">Cartão na entrega</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-zinc-50 pt-6 font-black">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Total do Pedido</span>
                    <p className="text-3xl italic text-green-600 tracking-tighter">R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}</p>
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
                <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-bold text-orange-600 text-sm"><ArrowLeft size={16} /> Voltar</button>
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
            /* LISTA DE PEDIDOS DO CLIENTE */
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Meus pedidos</h2>
              {todosOsPedidos.length === 0 ? (
                <div className="py-24 text-center">
                  <ClipboardList size={40} className="mx-auto text-zinc-200 mb-4" />
                  <p className="text-lg font-black text-zinc-800 uppercase">Nenhum pedido realizado</p>
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
                    <div className="bg-zinc-50 rounded-2xl p-4 text-xs font-medium text-zinc-500 border border-zinc-100">
                      {p.itens.map(i => i.nome).join(', ')}
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-50 flex justify-between items-center font-black">
                       <p className="text-2xl italic tracking-tighter">R$ {p.total.toFixed(2)}</p>
                       <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{p.pagamento}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* PERFIL PROFISSIONAL DO CLIENTE */
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-6 py-10 border-b border-zinc-100 bg-white -mx-5 px-5">
                <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                  <User size={48} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
                  <p className="text-zinc-400 font-bold text-sm mt-1">@{usuarioUsername}</p>
                  <p className="text-zinc-300 text-[10px] font-bold tracking-widest mt-2">{usuarioEmail}</p>
                </div>
              </div>

              <div className="mt-8 space-y-1">
                <h3 className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Minha Atividade</h3>
                <button className="w-full flex items-center justify-between p-5 bg-white border-b border-zinc-50 hover:bg-zinc-50 group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                      <MapPin size={20} className="text-zinc-500 group-hover:text-orange-600" />
                    </div>
                    <span className="font-bold text-zinc-700">Meus Endereços</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-white border-b border-zinc-50 hover:bg-zinc-50 group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                      <ClipboardList size={20} className="text-zinc-500 group-hover:text-orange-600" />
                    </div>
                    <span className="font-bold text-zinc-700">Histórico de Pedidos</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300" />
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 bg-white border-t border-b border-zinc-50 hover:bg-red-50 group mt-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                      <LogOut size={20} className="text-red-500" />
                    </div>
                    <span className="font-bold text-red-500">Sair da Conta</span>
                  </div>
                </button>
              </div>
            </div>
          )
        )}

        {visao === 'Vendedor' && (
          /* --- ÁREA DO VENDEDOR --- */
          <div className="space-y-8 animate-in slide-in-from-bottom">
            <div className="flex bg-zinc-200 p-2 rounded-[30px] shadow-inner">
              <button onClick={() => setAbaVendedor('Pedidos')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Pedidos' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>PAINEL VENDAS</button>
              <button onClick={() => setAbaVendedor('Cardapio')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Cardapio' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>MEU CARDÁPIO</button>
            </div>
            {abaVendedor === 'Pedidos' ? (
              todosOsPedidos.length === 0 ? <p className="py-20 text-center font-bold text-zinc-300 uppercase">Aguardando novos pedidos...</p> :
              todosOsPedidos.map((p: Pedido) => (
                <div key={p.id} className="bg-white p-8 rounded-[45px] border-l-12 border-orange-500 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-zinc-800">{p.clienteNome}</h3>
                    <span className="text-[10px] font-black text-zinc-400 uppercase bg-zinc-50 px-3 py-1 rounded-full">{p.status}</span>
                  </div>
                  <div className="bg-zinc-50 p-5 rounded-3xl font-bold italic text-zinc-500 text-sm border border-zinc-100">
                    {p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}
                  </div>
                  <p className="flex items-center gap-2 text-xs font-bold text-zinc-400 px-2 uppercase"><MapPin size={14} /> {p.endereco}</p>
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
                    <div key={p.id} className="bg-white p-6 rounded-[35px] border border-zinc-100 flex justify-between items-center shadow-sm">
                      <div>
                        <h4 className="font-black text-zinc-800">{p.nome}</h4>
                        <p className="font-black text-green-600 text-sm italic">R$ {p.preco.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removerProdutoVendedor(p.id)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {visao === 'Admin' && (
          /* --- ÁREA DO ADMINISTRADOR --- */
          <div className="space-y-10 animate-in slide-in-from-top">
            <h2 className="text-center text-2xl font-black text-zinc-800 uppercase italic tracking-tighter">PedeAí Admin Platform</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">Faturamento Global</p>
                <p className="text-3xl font-black text-green-600 italic tracking-tighter leading-none">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
              </div>
              <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">Lojas Ativas</p>
                <p className="text-3xl font-black text-orange-600 leading-none">{todasAsLojas.filter(l => l.status === 'Ativa').length}</p>
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
                    <button 
                      onClick={() => gerenciarLojaAdmin(loja.id, loja.status === 'Ativa' ? 'Bloquear' : 'Aprovar')} 
                      className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest ${loja.status === 'Ativa' ? 'bg-red-50 text-red-500' : 'bg-zinc-900 text-white'}`}
                    >
                      {loja.status === 'Ativa' ? <Lock size={12} /> : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR FIXO PROFISSIONAL */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button 
          onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); }} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Inicio</span>
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
          <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
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