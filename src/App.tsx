import { useState } from 'react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'

/**
 * --- COMPONENTE PRINCIPAL APP ---
 * Este arquivo orquestra toda a lógica do PedeAí, gerenciando desde a 
 * entrada do usuário até o fluxo completo de pedidos em tempo real.
 */
function App() {
  // --- ESTADOS DE ACESSO E SEGURANÇA (RF01, RF02) ---
  // Controlamos se o usuário está dentro do sistema e quais são suas credenciais.
  const [estaLogado, setEstaLogado] = useState(false);
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  
  // Dados fundamentais do perfil do usuário logado
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState('');
  const [usuarioUsername, setUsuarioUsername] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioSenha, setUsuarioSenha] = useState('');
  const [usuarioSenhaConfirm, setUsuarioSenhaConfirm] = useState('');

  // Campos que capturam a digitação na tela de Login
  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');

  // Estados de definição de perfil no Cadastro
  const [tipoUsuario, setTipoUsuario] = useState<'Cliente' | 'Vendedor' | 'Admin'>('Cliente');
  const [nomeLoja, setNomeLoja] = useState('');

  // --- ESTADOS DE NAVEGAÇÃO PRINCIPAL ---
  // Gerenciam a troca de telas entre os diferentes tipos de usuários do sistema.
  const [visao, setVisao] = useState<'Cliente' | 'Vendedor' | 'Admin'>('Cliente');
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');

  // --- ESTADOS DE DADOS (Simulação de Banco de Dados) ---
  // Aqui ficam armazenadas as informações de Lojas, Produtos e Pedidos.
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([
    { id: 1, nome: "Pizzaria do João", categoria: "Pizzas", imagem: "🍕", status: 'Ativa' },
    { id: 2, nome: "Hambúrguer da Vila", categoria: "Lanches", imagem: "🍔", status: 'Ativa' },
    { id: 3, nome: "Doces da Maria", categoria: "Doceria", imagem: "🍰", status: 'Ativa' },
    { id: 4, nome: "Sushiman da Cidade", categoria: "Japonesa", imagem: "🍣", status: 'Ativa' },
    { id: 5, nome: "Farmácia Central", categoria: "Saúde", imagem: "💊", status: 'Pendente' },
    { id: 6, nome: "Supermercado Econômico", categoria: "Mercado", imagem: "🛒", status: 'Ativa' },
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
  
  // --- ESTADOS TEMPORÁRIOS DE COMPRA (USADOS PELO CLIENTE) ---
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  /**
   * --- FUNÇÕES DE LÓGICA DO SISTEMA ---
   */

  // Lógica de Entrada (Login)
  const handleLogin = () => {
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      alert("Por favor, informe seu login e sua senha.");
      return;
    }
    // Simulamos a entrada e preenchemos os dados de exibição
    if (!usuarioNomeCompleto) setUsuarioNomeCompleto("Angelo Silvano");
    if (!usuarioUsername) setUsuarioUsername(campoLoginIdentificacao);
    setEstaLogado(true);
  };

  // Lógica de Registro (Cadastro)
  const handleCadastro = () => {
    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      alert("Preencha todos os campos obrigatórios para criar sua conta.");
      return;
    }
    if (usuarioSenha !== usuarioSenhaConfirm) {
      alert("As senhas digitadas não coincidem!");
      return;
    }
    alert("Conta criada com sucesso! PedeAí, pediu chegou.");
    setTelaAuth('Login');
  };

  // Carrinho
  const adicionarProdutoAoCarrinho = (p: Produto) => {
    setCarrinho([...carrinho, p]);
  };

  // Fechamento de Pedido
  const realizarPedidoFinal = () => {
    if (!enderecoEntrega) {
      alert("O endereço de entrega é fundamental para que o pedido chegue!");
      return;
    }
    
    const novoPedido: Pedido = {
      id: crypto.randomUUID(),
      lojaNome: lojaSelecionada?.nome || 'Estabelecimento PedeAí',
      clienteNome: usuarioNomeCompleto || "Angelo Silvano",
      clienteUsername: usuarioUsername || "angelosilvanno",
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
    alert("Pedido enviado com sucesso! PedeAí, pediu chegou.");
  };

  // Funções do Painel do Vendedor
  const mudarStatusPedidoVendedor = (id: string, novoStatus: Pedido['status']) => {
    setTodosOsPedidos(todosOsPedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
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
    }
  };

  const removerProdutoVendedor = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setTodosOsProdutos(todosOsProdutos.filter(p => p.id !== id));
    }
  };

  // Funções do Painel Administrativo
  const gerenciarLojaAdmin = (id: number, acao: 'Aprovar' | 'Bloquear') => {
    setTodasAsLojas(todasAsLojas.map(l => {
      if (l.id === id) {
        return { ...l, status: acao === 'Aprovar' ? 'Ativa' : 'Bloqueada' };
      }
      return l;
    }));
  };

  const cardapioParaExibir = todosOsProdutos.filter(p => p.lojaId === lojaSelecionada?.id);

  // --- RENDERIZAÇÃO DA TELA DE LOGIN/CADASTRO ---
  if (!estaLogado) {
    return (
      <AuthScreen 
        telaAuth={telaAuth}
        setTelaAuth={setTelaAuth}
        campoLoginIdentificacao={campoLoginIdentificacao}
        setCampoLoginIdentificacao={setCampoLoginIdentificacao}
        campoLoginSenha={campoLoginSenha}
        setCampoLoginSenha={setCampoLoginSenha}
        usuarioNomeCompleto={usuarioNomeCompleto}
        setUsuarioNomeCompleto={setUsuarioNomeCompleto}
        usuarioUsername={usuarioUsername}
        setUsuarioUsername={setUsuarioUsername}
        usuarioEmail={usuarioEmail}
        setUsuarioEmail={setUsuarioEmail}
        usuarioSenha={usuarioSenha}
        setUsuarioSenha={setUsuarioSenha}
        usuarioSenhaConfirm={usuarioSenhaConfirm}
        setUsuarioSenhaConfirm={setUsuarioSenhaConfirm}
        tipoUsuario={tipoUsuario}
        setTipoUsuario={setTipoUsuario}
        nomeLoja={nomeLoja}
        setNomeLoja={setNomeLoja}
        handleLogin={handleLogin}
        handleCadastro={handleCadastro}
      />
    );
  }

  // --- INTERFACE PRINCIPAL APÓS O LOGIN ---
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-40 font-sans selection:bg-orange-200">
      
      {/* SELETOR DE MODOS (Exclusivo para Testes em Desenvolvimento) */}
      <div className="sticky top-0 z-50 flex justify-center gap-6 bg-zinc-950 p-2 text-[9px] text-white shadow-2xl">
        <button onClick={() => setVisao('Cliente')} className={visao === 'Cliente' ? 'border-b-2 border-orange-400 pb-1 font-black text-orange-400' : 'opacity-30'}>VISÃO CLIENTE</button>
        <button onClick={() => setVisao('Vendedor')} className={visao === 'Vendedor' ? 'border-b-2 border-orange-400 font-black text-orange-400' : 'opacity-30'}>VISÃO VENDEDOR</button>
        <button onClick={() => setVisao('Admin')} className={visao === 'Admin' ? 'border-b-2 border-orange-400 font-black text-orange-400' : 'opacity-30'}>VISÃO ADMIN</button>
      </div>

      <header className="relative overflow-hidden bg-orange-600 p-8 text-center text-white shadow-xl leading-tight">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">PedeAí</h1>
        <p className="mt-1 text-[10px] font-bold tracking-[0.4em] uppercase opacity-80">PedeAí, pediu chegou</p>
      </header>

      <main className="mx-auto max-w-xl p-5">
        
        {visao === 'Cliente' && (
          /* --- ÁREA DO CLIENTE --- */
          abaAtiva === 'Inicio' ? (
            estaFinalizando ? (
              /* TELA DE CHECKOUT (FINALIZAÇÃO) */
              <div className="space-y-6 animate-in slide-in-from-right duration-400">
                <button onClick={() => setEstaFinalizando(false)} className="group flex items-center gap-2 font-black text-orange-600">
                  <span className="transition-transform group-hover:-translate-x-1">←</span> Voltar para a sacola
                </button>
                <div className="space-y-6 rounded-[40px] border border-zinc-100 bg-white p-10 shadow-sm">
                  <h2 className="text-center text-xl font-black tracking-tight text-zinc-800 uppercase leading-none">Finalizar compra</h2>
                  
                  <div className="space-y-3">
                    <label className="ml-3 text-[10px] font-black tracking-widest text-zinc-400 uppercase">Endereço de Entrega</label>
                    <input 
                      type="text" 
                      placeholder="Rua, número e bairro" 
                      className="w-full rounded-3xl bg-zinc-50 p-5 font-medium outline-none ring-orange-100 focus:ring-4" 
                      value={enderecoEntrega} 
                      onChange={(e) => setEnderecoEntrega(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="ml-3 text-[10px] font-black text-zinc-400 uppercase">Pagamento</label>
                    <select 
                      className="w-full appearance-none rounded-3xl bg-zinc-50 p-5 font-bold outline-none ring-orange-100 focus:ring-4" 
                      value={formaPagamento} 
                      onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                      <option value="Dinheiro">Dinheiro na entrega</option>
                      <option value="Pix">Pix Instantâneo</option>
                      <option value="Cartão">Cartão na entrega</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-zinc-50 pt-6 text-right font-black">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Total:</span>
                    <p className="text-3xl italic tracking-tighter text-green-600">R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}</p>
                  </div>

                  <button onClick={realizarPedidoFinal} className="w-full rounded-3xl bg-orange-600 p-6 text-xl font-black text-white shadow-lg transition-all active:scale-95">Confirmar Agora!</button>
                </div>
              </div>
            ) : !lojaSelecionada ? (
              /* LISTAGEM DE ESTABELECIMENTOS */
              <div className="space-y-8">
                <h2 className="ml-2 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Onde vamos pedir hoje?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {todasAsLojas.filter(l => l.status === 'Ativa').map(loja => (
                    <div 
                      key={loja.id} 
                      onClick={() => setLojaSelecionada(loja)} 
                      className="group flex cursor-pointer items-center rounded-[35px] border border-zinc-100 bg-white p-7 shadow-sm transition-all hover:shadow-lg active:scale-95"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-5xl shadow-inner transition-transform group-hover:scale-110">{loja.imagem}</div>
                      <div className="ml-6">
                        <h3 className="text-base font-black tracking-tight text-zinc-800 leading-tight">{loja.nome}</h3>
                        <p className="mt-1 text-[10px] font-bold tracking-tighter text-zinc-400 uppercase">{loja.categoria} • ENTREGA EM 30 MIN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* VISUALIZAÇÃO DO CARDÁPIO */
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-black text-orange-600"><span>←</span> Outros estabelecimentos</button>
                <div className="flex items-center gap-6">
                   <div className="rounded-3xl border border-zinc-100 bg-white p-4 text-6xl shadow-sm leading-none">{lojaSelecionada.imagem}</div>
                   <h2 className="text-3xl font-black tracking-tighter text-zinc-800 leading-tight">{lojaSelecionada.nome}</h2>
                </div>
                <div className="space-y-4">
                  {cardapioParaExibir.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-5 rounded-[30px] border border-zinc-50 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                      <div className="flex-1">
                        <h4 className="text-lg font-black tracking-tight text-zinc-800 leading-tight">{item.nome}</h4>
                        <p className="my-1 text-xs font-medium text-zinc-400 leading-snug">{item.descricao}</p>
                        <p className="mt-1 text-lg font-black tracking-tighter text-green-600">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => adicionarProdutoAoCarrinho(item)} 
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-3xl font-black text-white shadow-lg transition-all active:scale-90 leading-none"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : abaAtiva === 'Pedidos' ? (
            /* LISTA DE PEDIDOS REALIZADOS */
            <div className="space-y-8 animate-in fade-in duration-700">
              <h2 className="ml-2 text-2xl font-black tracking-tight text-zinc-800 uppercase leading-tight">Meus Pedidos</h2>
              {todosOsPedidos.length === 0 ? (
                <div className="py-24 text-center text-zinc-300">
                  <p className="mb-4 text-6xl opacity-50 leading-none">🥡</p>
                  <p className="text-xl font-black tracking-tight uppercase">Nenhum pedido ainda.</p>
                  <button onClick={() => setAbaAtiva('Inicio')} className="mt-4 border-b-2 border-orange-100 text-lg font-black tracking-widest text-orange-600 transition-all uppercase">Bora pedir?</button>
                </div>
              ) : (
                todosOsPedidos.map(p => (
                  <div key={p.id} className="space-y-4 rounded-[45px] border border-zinc-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-black tracking-tighter text-zinc-800 leading-tight">{p.lojaNome}</h3>
                        <p className="mt-1 font-mono text-[10px] font-bold italic tracking-widest text-zinc-400">ID: {p.id.split('-')[0]}</p>
                      </div>
                      <span className={`rounded-full px-5 py-2.5 text-[10px] font-black shadow-inner leading-none ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-500' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4 text-sm font-bold italic text-zinc-500">
                      {p.itens.map(i => i.nome).join(', ')}
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-50 pt-2">
                       <p className="text-xl font-black tracking-tighter text-zinc-800">R$ {p.total.toFixed(2)}</p>
                       <p className="rounded-lg bg-zinc-100 px-3 py-1 text-[11px] font-black tracking-widest text-zinc-400 uppercase">{p.pagamento}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* VISÃO DO PERFIL DO CLIENTE */
            <div className="space-y-10 text-center animate-in fade-in duration-700">
              <h2 className="text-center text-2xl font-black tracking-tight text-zinc-800 uppercase leading-tight">Meu Perfil</h2>
              <div className="relative overflow-hidden rounded-[55px] border border-zinc-100 bg-white p-12 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[40px] border-8 border-white bg-orange-100 text-7xl shadow-xl shadow-orange-100 leading-none">👤</div>
                <div className="mt-6">
                  <h3 className="text-3xl font-black tracking-tighter text-zinc-800 capitalize leading-tight">
                    {usuarioNomeCompleto || 'Angelo Silvano'}
                  </h3>
                  <p className="mt-1 text-base font-bold tracking-wide text-zinc-400 lowercase opacity-80 leading-none">
                    @{usuarioUsername.toLowerCase() || 'angelosilvanno'}
                  </p>
                  <p className="mt-2 text-[10px] font-bold italic tracking-widest text-zinc-300 uppercase opacity-60 leading-none">{usuarioEmail || 'contato@pedeai.com'}</p>
                </div>
                <div className="mt-8 space-y-3 border-t border-zinc-50 pt-8 text-left font-black">
                  <button className="w-full rounded-[25px] border border-zinc-100 bg-zinc-50 p-6 text-sm font-black text-zinc-600 transition-all hover:bg-zinc-100 leading-none">Endereços Salvos</button>
                  <button className="w-full rounded-[25px] border border-zinc-100 bg-zinc-50 p-6 text-sm font-black text-zinc-600 transition-all hover:bg-zinc-100 leading-none">Meus Favoritos</button>
                  <button onClick={() => setEstaLogado(false)} className="mt-4 w-full rounded-[25px] border-2 border-red-50 p-6 text-[10px] font-black tracking-widest text-red-500 shadow-sm transition-all hover:bg-red-50 active:bg-red-50 uppercase leading-none">Sair da Conta</button>
                </div>
              </div>
            </div>
          )
        )}

        {visao === 'Vendedor' && (
          /* --- ÁREA DO VENDEDOR --- */
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex gap-3 rounded-[35px] bg-zinc-200 p-2.5 shadow-inner">
              <button onClick={() => setAbaVendedor('Pedidos')} className={`flex-1 rounded-[25px] p-5 text-xs font-black tracking-widest transition-all leading-none ${abaVendedor === 'Pedidos' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>VENDAS</button>
              <button onClick={() => setAbaVendedor('Cardapio')} className={`flex-1 rounded-[25px] p-5 text-xs font-black tracking-widest transition-all leading-none ${abaVendedor === 'Cardapio' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>CARDÁPIO</button>
            </div>
            {abaVendedor === 'Pedidos' ? (
              todosOsPedidos.length === 0 ? <p className="py-32 text-center font-black italic tracking-widest text-zinc-300 uppercase leading-loose">Aguardando seu primeiro pedido... 🍕</p> :
              todosOsPedidos.map(p => (
                <div key={p.id} className={`transform space-y-6 rounded-[45px] border-l-10 bg-white p-8 shadow-lg transition-all hover:scale-[1.02] ${p.status === 'Entregue' ? 'border-zinc-300 opacity-60' : 'border-orange-500'}`}>
                  <div className="flex items-center justify-between leading-tight">
                    <h3 className="text-lg font-black tracking-tighter text-zinc-800 uppercase leading-tight">{p.clienteNome}</h3>
                    <span className="rounded-full bg-zinc-100 px-5 py-2 text-[9px] font-black tracking-widest text-zinc-500 uppercase leading-none">{p.status}</span>
                  </div>
                  <div className="space-y-2 rounded-[30px] border border-zinc-100 bg-zinc-50 p-6 text-base font-black italic text-zinc-600 shadow-inner">
                    {p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}
                  </div>
                  <p className="ml-2 text-xs font-black italic tracking-tight text-zinc-400 uppercase leading-none">📍 Entrega: {p.endereco}</p>
                  <div className="flex gap-4 pt-2">
                    {p.status === 'Pendente' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Preparando')} className="flex-1 rounded-[25px] bg-green-600 p-6 text-xs font-black text-white shadow-xl transition-all hover:bg-green-700 uppercase leading-none">Aceitar</button>}
                    {p.status === 'Preparando' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Saiu para Entrega')} className="flex-1 rounded-[25px] bg-blue-600 p-6 text-xs font-black text-white shadow-xl transition-all hover:bg-blue-700 uppercase leading-none">Despachar</button>}
                    {p.status === 'Saiu para Entrega' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Entregue')} className="flex-1 rounded-[25px] bg-zinc-950 p-5 text-xs font-black text-white shadow-xl transition-all hover:bg-black uppercase leading-none">Concluir</button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-8 font-black">
                <button onClick={cadastrarNovoProdutoVendedor} className="w-full rounded-[35px] bg-orange-600 p-8 text-xl font-black text-white shadow-2xl shadow-orange-100 transition-all hover:bg-orange-700 active:scale-95 uppercase tracking-widest leading-none">+ Novo Item</button>
                <div className="space-y-4 px-2">
                  <h3 className="ml-2 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase leading-none">Produtos Ativos</h3>
                  {todosOsProdutos.filter(p => p.lojaId === 1).map(p => (
                    <div key={p.id} className="group flex items-center justify-between rounded-[35px] border-2 border-zinc-100 bg-white p-6 shadow-sm transition-all">
                      <div className="flex flex-col">
                        <h4 className="text-lg font-black tracking-tight text-zinc-800 transition-colors group-hover:text-orange-600 leading-tight">{p.nome}</h4>
                        <p className="mt-1 text-sm font-black italic tracking-tighter text-green-600 leading-none">R$ {p.preco.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removerProdutoVendedor(p.id)} className="rounded-[20px] border-2 border-red-50 p-4 text-[10px] font-black tracking-tighter text-red-500 transition-all hover:bg-red-50 uppercase leading-none">Excluir</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {visao === 'Admin' && (
          /* --- ÁREA DO ADMINISTRADOR --- */
          <div className="space-y-10 font-black animate-in slide-in-from-top duration-500">
            <h2 className="text-center text-2xl font-black tracking-tighter text-zinc-800 uppercase leading-tight">Painel PedeAí Admin</h2>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="rounded-[50px] border border-zinc-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg leading-none">
                <p className="mb-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">Vendidos</p>
                <p className="text-2xl font-black italic tracking-tighter text-green-600">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
              </div>
              <div className="rounded-[50px] border border-zinc-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg leading-none">
                <p className="mb-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase">Parceiros</p>
                <p className="text-2xl font-black tracking-tighter text-orange-600">{todasAsLojas.length}</p>
              </div>
            </div>
            <div className="space-y-5 px-2">
              <h3 className="ml-2 text-xs font-black tracking-[0.2em] text-zinc-400 uppercase leading-none">Gestão de Parceiros</h3>
              {todasAsLojas.map(loja => (
                <div key={loja.id} className="flex items-center justify-between rounded-[40px] border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-5 leading-none">
                    <span className="rounded-2xl bg-zinc-50 p-3 text-4xl shadow-inner leading-none">{loja.imagem}</span>
                    <div>
                      <h4 className="mb-1 text-base font-black tracking-tight text-zinc-800 leading-tight">{loja.nome}</h4>
                      <p className={`text-[9px] font-black tracking-wider uppercase leading-none ${loja.status === 'Ativa' ? 'text-green-500' : 'text-red-400'}`}>{loja.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {loja.status === 'Ativa' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Bloquear')} className="rounded-[20px] border-2 border-red-100 bg-red-50 px-6 py-4 text-[9px] font-black tracking-tighter text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white uppercase leading-none">Bloquear</button>}
                    {loja.status === 'Bloqueada' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="rounded-[20px] bg-zinc-950 px-6 py-4 text-[9px] font-black tracking-widest text-white shadow-lg transition-all hover:bg-black uppercase leading-none">Ativar</button>}
                    {loja.status === 'Pendente' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="rounded-[20px] bg-green-600 px-6 py-4 text-[9px] font-black tracking-widest text-white shadow-lg transition-all hover:bg-green-700 uppercase leading-none">Aprovar</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR FIXO PARA O CLIENTE */}
      {visao === 'Cliente' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-xl justify-around rounded-t-[45px] border-t border-zinc-100 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); }} 
            className={`flex flex-col items-center gap-1 font-black transition-all duration-300 ${abaAtiva === 'Inicio' ? 'scale-105 text-orange-600' : 'text-zinc-300'}`}
          >
            <span className="text-2xl leading-none">🏠</span><span className="text-[10px] tracking-tighter uppercase leading-none">Bora</span>
          </button>
          <button 
            onClick={() => setAbaAtiva('Pedidos')} 
            className={`flex flex-col items-center gap-1 font-black transition-all duration-300 ${abaAtiva === 'Pedidos' ? 'scale-105 text-orange-600' : 'text-zinc-300'}`}
          >
            <span className="text-2xl leading-none">📋</span><span className="text-[10px] tracking-tighter uppercase leading-none">Pedidos</span>
          </button>
          <button 
            onClick={() => setAbaAtiva('Perfil')} 
            className={`flex flex-col items-center gap-1 font-black transition-all duration-300 ${abaAtiva === 'Perfil' ? 'scale-105 text-orange-600' : 'text-zinc-300'}`}
          >
            <span className="text-2xl leading-none">👤</span><span className="text-[10px] tracking-tighter uppercase leading-none">Eu</span>
          </button>
        </nav>
      )}

      {/* BARRA DE CARRINHO */}
      {visao === 'Cliente' && abaAtiva === 'Inicio' && !estaFinalizando && carrinho.length > 0 && (
        <div className="fixed bottom-32 left-6 right-6 z-40 mx-auto max-w-md animate-in slide-in-from-bottom duration-600">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="flex w-full items-center justify-between rounded-[35px] bg-green-600 p-6 font-black text-white shadow-2xl shadow-green-100 ring-4 ring-white transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
               <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500 bg-green-700 text-lg italic tracking-tighter shadow-inner leading-none">🛒</div>
               <div className="text-left leading-none">
                 <span className="text-[10px] tracking-widest uppercase opacity-70">Finalizar compra</span>
                 <p className="mt-1 text-base tracking-tighter uppercase">{carrinho.length} ITENS NA SACOLA</p>
               </div>
            </div>
            <div className="text-right">
              <span className="text-xl italic tracking-tighter leading-none">R$ {carrinho.reduce((s, i) => s + i.preco, 0).toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;