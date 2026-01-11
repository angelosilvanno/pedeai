import { useState } from 'react'

/**
 * --- MOLDES DE ORGANIZAÇÃO (TypeScript) ---
 * Estruturas que definem a alma dos dados do sistema PedeAí.
 */

interface Loja { 
  id: number; 
  nome: string; 
  categoria: string; 
  imagem: string; 
  status: 'Pendente' | 'Ativa' | 'Bloqueada'; 
}

interface Produto { 
  id: string; 
  lojaId: number; 
  nome: string; 
  preco: number; 
  descricao: string; 
}

interface Pedido {
  id: string;
  lojaNome: string;
  clienteNome: string;
  clienteUsername: string;
  itens: Produto[];
  total: number;
  endereco: string;
  pagamento: string;
  status: 'Pendente' | 'Preparando' | 'Saiu para Entrega' | 'Entregue';
}

function App() {
  /**
   * --- ESTADOS DE ACESSO E SEGURANÇA (RF01, RF02) ---
   */
  const [estaLogado, setEstaLogado] = useState(false);
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState('');
  const [usuarioUsername, setUsuarioUsername] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioSenha, setUsuarioSenha] = useState('');

  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');

  /**
   * --- ESTADOS DE NAVEGAÇÃO PRINCIPAL ---
   */
  const [visao, setVisao] = useState<'Cliente' | 'Vendedor' | 'Admin'>('Cliente');
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');

  /**
   * --- ESTADOS DE DADOS (Simulação de Banco de Dados) ---
   */
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([
    { id: 1, nome: "Pizzaria do João", categoria: "Pizzas", imagem: "🍕", status: 'Ativa' },
    { id: 2, nome: "Hambúrguer da Vila", categoria: "Lanches", imagem: "🍔", status: 'Ativa' },
    { id: 3, nome: "Doces da Maria", categoria: "Doceria", imagem: "🍰", status: 'Ativa' },
    { id: 4, nome: "Sushiman da Cidade", categoria: "Japonesa", imagem: "🍣", status: 'Ativa' },
    { id: 5, nome: "Farmácia Central", categoria: "Saúde", imagem: "💊", status: 'Pendente' },
    { id: 6, nome: "Supermercado Econômico", categoria: "Mercado", imagem: "🛒", status: 'Ativa' },
    { id: 7, nome: "Adega do Povo", categoria: "Bebidas", imagem: "🍺", status: 'Ativa' },
    { id: 8, nome: "Fruteira Municipal", categoria: "Hortifruti", imagem: "🍎", status: 'Ativa' },
  ]);

  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([
    // Produtos da Pizzaria (ID 1)
    { id: 'p1', lojaId: 1, nome: "Pizza Calabresa Familiar", preco: 45.90, descricao: "Mussarela, calabresa selecionada e cebola fatiada." },
    { id: 'p2', lojaId: 1, nome: "Pizza de Frango c/ Catupiry", preco: 49.00, descricao: "Frango desfiado temperado e Catupiry legítimo." },
    { id: 'p3', lojaId: 1, nome: "Pizza de Brigadeiro", preco: 42.00, descricao: "Chocolate ao leite coberto com granulado." },
    
    // Produtos da Hamburgueria (ID 2)
    { id: 'h1', lojaId: 2, nome: "X-Bacon Supremo", preco: 28.50, descricao: "Pão brioche, blend 150g, muito bacon e cheddar." },
    { id: 'h2', lojaId: 2, nome: "Smash Burger Simples", preco: 19.90, descricao: "Carne smash 90g, queijo e molho especial da casa." },
    { id: 'h3', lojaId: 2, nome: "Porção Batata Frita G", preco: 18.00, descricao: "500g de batata frita super crocante." },

    // Produtos da Doceria (ID 3)
    { id: 'd1', lojaId: 3, nome: "Bolo de Pote Ninho", preco: 15.00, descricao: "Bolo fofinho com creme de Ninho e morangos." },
    { id: 'd2', lojaId: 3, nome: "Fatia Torta Holandesa", preco: 12.50, descricao: "Creme leve com cobertura de chocolate meio amargo." },
    { id: 'd3', lojaId: 3, nome: "Caixa de Brigadeiros (6 un)", preco: 18.00, descricao: "Brigadeiros gourmet feitos com chocolate belga." },

    // Produtos do Japonês (ID 4)
    { id: 'j1', lojaId: 4, nome: "Combinado Tradicional (15 un)", preco: 55.00, descricao: "Sashimis, hossomakis e uramakis selecionados." },
    { id: 'j2', lojaId: 4, nome: "Temaki de Salmão Completo", preco: 29.90, descricao: "Salmão fresco, cream cheese e cebolinha." },

    // Produtos da Adega (ID 7)
    { id: 'a1', lojaId: 7, nome: "Cerveja Lata 350ml", preco: 5.50, descricao: "Gelada na temperatura ideal." },
    { id: 'a2', lojaId: 7, nome: "Vinho Tinto Suave", preco: 35.00, descricao: "Garrafa 750ml nacional." },
  ]);

  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>([]);
  
  /**
   * --- ESTADOS TEMPORÁRIOS DE COMPRA (CLIENTE) ---
   */
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  /**
   * --- FUNÇÕES DE LÓGICA DO SISTEMA ---
   */

  const handleEntrar = () => {
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      alert("Por favor, preencha sua identificação e senha.");
      return;
    }
    if (!usuarioUsername) setUsuarioUsername(campoLoginIdentificacao);
    setEstaLogado(true);
  };

  const handleCriarConta = () => {
    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      alert("Todos os campos são obrigatórios para o cadastro.");
      return;
    }
    alert("Conta criada com sucesso! PedeAí, pediu chegou.");
    setTelaAuth('Login');
  };

  const adicionarProdutoAoCarrinho = (p: Produto) => {
    setCarrinho([...carrinho, p]);
  };

  const realizarPedidoFinal = () => {
    if (!enderecoEntrega) {
      alert("O endereço de entrega é obrigatório!");
      return;
    }
    
    const novoPedido: Pedido = {
      id: crypto.randomUUID(),
      lojaNome: lojaSelecionada?.nome || 'Estabelecimento',
      clienteNome: usuarioNomeCompleto || usuarioUsername,
      clienteUsername: usuarioUsername,
      itens: carrinho,
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
    alert("Pedido enviado! PedeAí, pediu chegou!");
  };

  const mudarStatusPedidoVendedor = (id: string, novoStatus: Pedido['status']) => {
    setTodosOsPedidos(todosOsPedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
  };

  const cadastrarNovoProdutoVendedor = () => {
    const nome = prompt("Nome do produto:");
    const preco = prompt("Preço:");
    if (nome && preco) {
      const novoProduto: Produto = {
        id: crypto.randomUUID(),
        lojaId: 1, 
        nome,
        preco: parseFloat(preco.replace(',', '.')),
        descricao: "Novo item cadastrado pelo vendedor."
      };
      setTodosOsProdutos([...todosOsProdutos, novoProduto]);
    }
  };

  const removerProdutoVendedor = (id: string) => {
    if (confirm("Deseja remover este item permanentemente?")) {
      setTodosOsProdutos(todosOsProdutos.filter(p => p.id !== id));
    }
  };

  const gerenciarLojaAdmin = (id: number, acao: 'Aprovar' | 'Bloquear') => {
    setTodasAsLojas(todasAsLojas.map(l => {
      if (l.id === id) {
        return { ...l, status: acao === 'Aprovar' ? 'Ativa' : 'Bloqueada' };
      }
      return l;
    }));
  };

  const produtosExibidos = todosOsProdutos.filter(p => p.lojaId === lojaSelecionada?.id);

  /**
   * --- 1. TELA DE AUTENTICAÇÃO (LOGIN / CADASTRO) ---
   */
  if (!estaLogado) {
    return (
      <div className="min-h-screen bg-orange-600 flex flex-col items-center justify-center p-6 font-sans text-zinc-900">
        <div className="max-w-md w-full bg-white rounded-[45px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500">
          <div className="text-center space-y-2">
            {/* AJUSTE: text-2xl no topo do login conforme solicitado */}
            <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase">PedeAí</h1>
            <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em]">PedeAí, pediu chegou</p>
          </div>

          {telaAuth === 'Login' ? (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-zinc-800 tracking-tight">Bora pedir?</h2>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Username ou E-mail" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                  value={campoLoginIdentificacao}
                  onChange={(e) => setCampoLoginIdentificacao(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Sua senha" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                  value={campoLoginSenha}
                  onChange={(e) => setCampoLoginSenha(e.target.value)}
                />
              </div>
              <button onClick={handleEntrar} className="w-full bg-orange-600 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all">Entrar</button>
              <p className="text-center text-zinc-400 font-bold text-sm">
                Ainda não tem conta? <button onClick={() => setTelaAuth('Cadastro')} className="text-orange-600 font-black">Cadastre-se</button>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-zinc-800 tracking-tight">Criar Cadastro</h2>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium" 
                  value={usuarioNomeCompleto}
                  onChange={(e) => setUsuarioNomeCompleto(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Escolha um Username" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium" 
                  value={usuarioUsername}
                  onChange={(e) => setUsuarioUsername(e.target.value)}
                />
                <input 
                  type="email" 
                  placeholder="Seu melhor E-mail" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium" 
                  value={usuarioEmail}
                  onChange={(e) => setUsuarioEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Crie uma Senha" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium" 
                  value={usuarioSenha}
                  onChange={(e) => setUsuarioSenha(e.target.value)}
                />
              </div>
              <button onClick={handleCriarConta} className="w-full bg-zinc-800 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all">Finalizar Cadastro</button>
              <p className="text-center text-zinc-400 font-bold text-sm">
                Já é cliente? <button onClick={() => setTelaAuth('Login')} className="text-orange-600 font-black">Fazer Login</button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * --- 2. INTERFACE PRINCIPAL APÓS LOGIN ---
   */
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans">
      
      {/* SELETOR DE MODOS (Exclusivo para desenvolvimento e teste) */}
      <div className="bg-zinc-900 text-white text-[9px] p-2 flex justify-center gap-6 sticky top-0 z-50">
        <button onClick={() => setVisao('Cliente')} className={visao === 'Cliente' ? 'text-orange-400 font-black border-b-2 border-orange-400' : 'opacity-40'}>VISÃO CLIENTE</button>
        <button onClick={() => setVisao('Vendedor')} className={visao === 'Vendedor' ? 'text-orange-400 font-black border-b-2 border-orange-400' : 'opacity-40'}>VISÃO VENDEDOR</button>
        <button onClick={() => setVisao('Admin')} className={visao === 'Admin' ? 'text-orange-400 font-black border-b-2 border-orange-400' : 'opacity-40'}>VISÃO ADMIN</button>
      </div>

      <header className="bg-orange-600 text-white p-8 text-center shadow-md">
        {/* AJUSTE: text-2xl no cabeçalho conforme solicitado */}
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">PedeAí</h1>
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.4em]">PedeAí, pediu chegou</p>
      </header>

      <main className="max-w-xl mx-auto p-5">
        
        {visao === 'Cliente' && (
          /* --- ÁREA DO CLIENTE (RF03 - RF11) --- */
          abaAtiva === 'Inicio' ? (
            estaFinalizando ? (
              <div className="space-y-6 animate-in slide-in-from-right duration-400">
                <button onClick={() => setEstaFinalizando(false)} className="text-orange-600 font-black flex items-center gap-2 group">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para a sacola
                </button>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-6">
                  <h2 className="text-xl font-black text-zinc-800 tracking-tight">Finalizar compra</h2>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-3">Endereço de Entrega</label>
                    <input 
                      type="text" 
                      placeholder="Rua, número e bairro" 
                      className="w-full border-none p-5 rounded-3xl bg-zinc-50 outline-none focus:ring-4 ring-orange-100 font-medium" 
                      value={enderecoEntrega} 
                      onChange={(e) => setEnderecoEntrega(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase ml-3">Pagamento</label>
                    <select 
                      className="w-full border-none p-5 rounded-3xl bg-zinc-50 outline-none focus:ring-4 ring-orange-100 font-bold appearance-none" 
                      value={formaPagamento} 
                      onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Pix">Pix</option>
                      <option value="Cartão">Cartão na Entrega</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t-2 border-zinc-50 flex justify-between items-center text-right">
                    <span className="text-zinc-400 font-bold uppercase text-[10px]">Total:</span>
                    <p className="text-3xl font-black text-green-600">R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}</p>
                  </div>

                  <button onClick={realizarPedidoFinal} className="w-full bg-orange-600 text-white p-6 rounded-3xl font-black text-xl shadow-lg active:scale-95 transition-all">Confirmar Agora</button>
                </div>
              </div>
            ) : !lojaSelecionada ? (
              <div className="space-y-8">
                <h2 className="font-black text-zinc-400 text-[10px] uppercase tracking-widest ml-2">Lojas prontas para te atender</h2>
                <div className="grid grid-cols-1 gap-4">
                  {todasAsLojas.filter(l => l.status === 'Ativa').map(loja => (
                    <div 
                      key={loja.id} 
                      onClick={() => setLojaSelecionada(loja)} 
                      className="flex items-center bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100 cursor-pointer active:scale-95 transition-all hover:border-orange-300 group"
                    >
                      <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform">{loja.imagem}</div>
                      <div className="ml-6">
                        {/* AJUSTE: text-base conforme solicitado */}
                        <h3 className="font-black text-base text-zinc-800 tracking-tight">{loja.nome}</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{loja.categoria} • ENTREGA EM 30 MIN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <button onClick={() => setLojaSelecionada(null)} className="text-orange-600 font-black flex items-center gap-2"><span>←</span> Outras lojas</button>
                <div className="flex items-center gap-5 mb-8">
                   <div className="text-6xl bg-white p-4 rounded-3xl shadow-sm">{lojaSelecionada.imagem}</div>
                   <div>
                     <h2 className="text-3xl font-black text-zinc-800 tracking-tighter leading-none">{lojaSelecionada.nome}</h2>
                     <p className="text-zinc-400 font-bold text-sm mt-1 uppercase tracking-widest">{lojaSelecionada.categoria}</p>
                   </div>
                </div>

                <div className="space-y-5">
                  {produtosExibidos.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-zinc-50 flex justify-between items-center gap-5 transition-all hover:shadow-md">
                      <div className="flex-1">
                        <h4 className="font-black text-zinc-800 text-lg">{item.nome}</h4>
                        <p className="text-zinc-400 text-xs font-medium my-1 leading-snug">{item.descricao}</p>
                        <p className="text-green-600 font-black text-lg tracking-tighter">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => adicionarProdutoAoCarrinho(item)} 
                        className="bg-orange-600 text-white w-14 h-14 rounded-2xl font-black shadow-lg active:scale-90 transition-all flex items-center justify-center text-3xl"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : abaAtiva === 'Pedidos' ? (
            <div className="space-y-8 animate-in fade-in duration-700">
              <h2 className="text-3xl font-black text-zinc-800 tracking-tight ml-2">Meus Pedidos</h2>
              {todosOsPedidos.length === 0 ? (
                <div className="text-center py-32 text-zinc-300">
                  <div className="text-8xl mb-6 opacity-50">🥡</div>
                  <p className="font-black text-xl tracking-tight">Nenhuma fome atendida ainda.</p>
                  <button onClick={() => setAbaAtiva('Inicio')} className="text-orange-600 font-black mt-4 text-lg border-b-2 border-orange-100">Explorar cardápios</button>
                </div>
              ) : (
                todosOsPedidos.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 space-y-4 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-xl text-zinc-800 tracking-tighter">{p.lojaNome}</h3>
                        <p className="text-[10px] text-zinc-400 font-mono mt-1 font-bold tracking-widest">ID: {p.id.split('-')[0]}</p>
                      </div>
                      <span className={`text-[10px] font-black px-5 py-2.5 rounded-full shadow-inner ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-500' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-500 font-bold bg-zinc-50 p-4 rounded-3xl border border-zinc-100 italic">
                      {p.itens.map(i => i.nome).join(', ')}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
                       <p className="text-xl font-black text-zinc-800 tracking-tighter">R$ {p.total.toFixed(2)}</p>
                       <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-lg">{p.pagamento}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-10 text-center animate-in fade-in duration-700">
              <h2 className="text-3xl font-black text-zinc-800 tracking-tight text-center">Meu Perfil</h2>
              <div className="bg-white p-12 rounded-[55px] shadow-sm border border-zinc-100 space-y-8 text-center relative overflow-hidden">
                <div className="w-32 h-32 bg-orange-100 rounded-[40px] flex items-center justify-center text-7xl mx-auto border-8 border-white shadow-xl">👤</div>
                <div>
                  <h3 className="font-black text-3xl text-zinc-800 tracking-tighter">{usuarioNomeCompleto || usuarioUsername}</h3>
                  <p className="text-zinc-400 font-black text-sm uppercase tracking-widest mt-1">@{usuarioUsername}</p>
                  <p className="text-zinc-400 font-bold text-xs mt-1">{usuarioEmail}</p>
                </div>
                <div className="space-y-3 pt-6">
                  <button className="w-full bg-zinc-50 text-zinc-500 p-6 rounded-[25px] font-black text-sm hover:bg-zinc-100 transition-all border border-zinc-100">Meus Endereços</button>
                  <button className="w-full bg-zinc-50 text-zinc-500 p-6 rounded-[25px] font-black text-sm hover:bg-zinc-100 transition-all border border-zinc-100">Favoritos</button>
                  <button onClick={() => setEstaLogado(false)} className="w-full text-red-500 font-black p-6 border-2 border-red-50 rounded-[25px] active:bg-red-50 transition-all shadow-sm mt-4 uppercase text-xs tracking-widest">Sair da Conta</button>
                </div>
              </div>
            </div>
          )
        )}

        {visao === 'Vendedor' && (
          /* --- ÁREA DO VENDEDOR (RF12 - RF19) --- */
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex gap-3 bg-zinc-200 p-2.5 rounded-[35px] shadow-inner">
              <button 
                onClick={() => setAbaVendedor('Pedidos')} 
                className={`flex-1 p-5 rounded-[25px] font-black text-xs tracking-[0.2em] transition-all ${abaVendedor === 'Pedidos' ? 'bg-white shadow-md text-orange-600' : 'text-zinc-500'}`}
              >
                VENDAS
              </button>
              <button 
                onClick={() => setAbaVendedor('Cardapio')} 
                className={`flex-1 p-5 rounded-[25px] font-black text-xs tracking-[0.2em] transition-all ${abaVendedor === 'Cardapio' ? 'bg-white shadow-md text-orange-600' : 'text-zinc-500'}`}
              >
                CARDÁPIO
              </button>
            </div>

            {abaVendedor === 'Pedidos' ? (
              todosOsPedidos.length === 0 ? (
                <div className="text-center py-32 text-zinc-300 font-black italic text-xl uppercase tracking-[0.2em]">Aguardando pedidos... 🍕</div>
              ) : (
                todosOsPedidos.map(p => (
                  <div key={p.id} className={`bg-white p-8 rounded-[45px] shadow-lg border-l-10 ${p.status === 'Entregue' ? 'border-zinc-300 opacity-60' : 'border-orange-500'} space-y-6 transition-all transform hover:scale-[1.02]`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-lg text-zinc-800 tracking-tighter uppercase">{p.clienteNome}</h3>
                      <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-5 py-2 rounded-full tracking-widest uppercase">{p.status}</span>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-[30px] text-base font-black text-zinc-600 border border-zinc-100 italic space-y-2 shadow-inner">
                      {p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}
                    </div>
                    <p className="text-xs text-zinc-400 font-bold ml-2">📍 ENDEREÇO: {p.endereco}</p>
                    <div className="flex gap-4 pt-2">
                      {p.status === 'Pendente' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Preparando')} className="flex-1 bg-green-600 text-white p-6 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-green-700">Aceitar</button>}
                      {p.status === 'Preparando' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Saiu para Entrega')} className="flex-1 bg-blue-600 text-white p-6 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-blue-700">Despachar</button>}
                      {p.status === 'Saiu para Entrega' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Entregue')} className="flex-1 bg-zinc-950 text-white p-6 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-black">Concluir</button>}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="space-y-8">
                <button onClick={cadastrarNovoProdutoVendedor} className="w-full bg-orange-600 text-white p-8 rounded-[35px] font-black shadow-2xl text-xl hover:bg-orange-700 active:scale-95 transition-all uppercase tracking-widest">+ Novo Item</button>
                <div className="space-y-4 px-2">
                  <h3 className="font-black text-zinc-400 text-[10px] uppercase tracking-[0.3em] ml-2">Produtos no Ar</h3>
                  {todosOsProdutos.filter(p => p.lojaId === 1).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-[35px] border-2 border-zinc-100 flex justify-between items-center shadow-sm hover:border-orange-100 transition-all group">
                      <div className="flex flex-col">
                        <h4 className="font-black text-zinc-800 text-lg group-hover:text-orange-600 transition-colors">{p.nome}</h4>
                        <p className="text-green-600 font-black text-sm tracking-tighter">R$ {p.preco.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removerProdutoVendedor(p.id)} className="text-red-500 text-[10px] font-black border-2 border-red-50 p-4 rounded-[20px] hover:bg-red-50 uppercase tracking-tighter transition-all">Excluir</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {visao === 'Admin' && (
          /* --- ÁREA DO ADMINISTRADOR (RF20 - RF22) --- */
          <div className="space-y-10 animate-in slide-in-from-top duration-500">
            <h2 className="text-3xl font-black text-zinc-800 text-center tracking-tighter">Gerência PedeAí</h2>
            
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white p-8 rounded-[50px] shadow-sm border border-zinc-100 transition-all">
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2">Vendidos</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
              </div>
              <div className="bg-white p-8 rounded-[50px] shadow-sm border border-zinc-100 transition-all">
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2">Lojas</p>
                <p className="text-3xl font-black text-orange-600 tracking-tighter">{todasAsLojas.length}</p>
              </div>
            </div>

            <div className="space-y-5 px-2">
              <h3 className="font-black text-zinc-400 text-xs uppercase tracking-[0.2em] ml-2">Aprovação de Estabelecimentos</h3>
              <div className="space-y-4">
                {todasAsLojas.map(loja => (
                  <div key={loja.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-zinc-100 flex justify-between items-center transition-all hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <span className="text-4xl bg-zinc-50 p-3 rounded-2xl">{loja.imagem}</span>
                      <div>
                        <h4 className="font-black text-base text-zinc-800 leading-none mb-1">{loja.nome}</h4>
                        <p className={`text-[9px] font-black uppercase tracking-wider ${loja.status === 'Ativa' ? 'text-green-500' : 'text-red-400'}`}>{loja.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {loja.status === 'Ativa' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Bloquear')} className="bg-red-50 text-red-500 text-[9px] px-6 py-4 rounded-[20px] font-black border-2 border-red-100 uppercase tracking-tighter transition-all">Bloquear</button>}
                      {loja.status === 'Bloqueada' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="bg-zinc-950 text-white text-[9px] px-6 py-4 rounded-[20px] font-black shadow-lg uppercase tracking-widest transition-all">Ativar</button>}
                      {loja.status === 'Pendente' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="bg-green-600 text-white text-[9px] px-6 py-4 rounded-[20px] font-black shadow-lg uppercase tracking-widest transition-all">Aprovar</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR FIXO PARA O CLIENTE */}
      {visao === 'Cliente' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-zinc-200 p-6 flex justify-around max-w-xl mx-auto z-50 rounded-t-[55px] shadow-[0_-15px_50px_rgba(0,0,0,0.05)]">
          {/* AJUSTE: scale-105 e text-[10px] conforme solicitado */}
          <button 
            onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); }} 
            className={`flex flex-col items-center gap-1 transition-all ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-3xl">🏠</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Bora</span>
          </button>
          
          <button 
            onClick={() => setAbaAtiva('Pedidos')} 
            className={`flex flex-col items-center gap-1 transition-all ${abaAtiva === 'Pedidos' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-3xl">📋</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Pedidos</span>
          </button>
          
          <button 
            onClick={() => setAbaAtiva('Perfil')} 
            className={`flex flex-col items-center gap-1 transition-all ${abaAtiva === 'Perfil' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-3xl">👤</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Eu</span>
          </button>
        </nav>
      )}

      {/* BARRA FLUTUANTE DE CARRINHO (Aparece conforme RF05 e RF08) */}
      {visao === 'Cliente' && abaAtiva === 'Inicio' && !estaFinalizando && carrinho.length > 0 && (
        <div className="fixed bottom-36 left-8 right-8 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom duration-700">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="w-full bg-green-600 text-white p-7 rounded-[40px] font-black shadow-[0_25px_60px_rgba(22,101,52,0.3)] flex justify-between items-center active:scale-95 transition-all ring-8 ring-white"
          >
            <div className="flex items-center gap-5">
               <div className="bg-green-700 w-12 h-12 rounded-[20px] flex items-center justify-center text-xl shadow-inner border border-green-500">🛒</div>
               <div className="text-left leading-none">
                 <span className="text-xs font-black tracking-widest uppercase opacity-80">Finalizar compra</span>
                 <p className="text-lg font-black tracking-tighter mt-1">{carrinho.length} Itens na sacola</p>
               </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black tracking-tighter">R$ {carrinho.reduce((s, i) => s + i.preco, 0).toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;