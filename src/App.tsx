import { useState } from 'react'
import type { Loja, Produto, Pedido } from './types'
import { AuthScreen } from './components/AuthScreen'

function App() {
  // --- ESTADOS DE ACESSO E SEGURANÇA (RF01, RF02) ---
  // Estes estados controlam quem entra no sistema e como as informações são guardadas.
  const [estaLogado, setEstaLogado] = useState(false);
  const [telaAuth, setTelaAuth] = useState<'Login' | 'Cadastro'>('Login');
  
  // Dados fundamentais do perfil do usuário
  const [usuarioNomeCompleto, setUsuarioNomeCompleto] = useState('');
  const [usuarioUsername, setUsuarioUsername] = useState('');
  const [usuarioEmail, setUsuarioEmail] = useState('');
  const [usuarioSenha, setUsuarioSenha] = useState('');

  // Campos que capturam o que é digitado no Login
  const [campoLoginIdentificacao, setCampoLoginIdentificacao] = useState('');
  const [campoLoginSenha, setCampoLoginSenha] = useState('');

  // ESTADO CORRIGIDO: Adicionado 'Admin' para ser compatível com as props de AuthScreen
  const [tipoUsuario, setTipoUsuario] = useState<'Cliente' | 'Vendedor' | 'Admin'>('Cliente');
  const [nomeLoja, setNomeLoja] = useState('');

  // --- ESTADOS DE NAVEGAÇÃO PRINCIPAL ---
  const [visao, setVisao] = useState<'Cliente' | 'Vendedor' | 'Admin'>('Cliente');
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');

  // --- ESTADOS DE DADOS (Simulação de Banco de Dados Completo) ---
  const [todasAsLojas, setTodasAsLojas] = useState<Loja[]>([
    { id: 1, nome: "Pizzaria do João", categoria: "Pizzas", imagem: "🍕", status: 'Ativa' },
    { id: 2, nome: "Hambúrguer da Vila", categoria: "Lanches", imagem: "🍔", status: 'Ativa' },
    { id: 3, nome: "Doces da Maria", categoria: "Doceria", imagem: "🍰", status: 'Ativa' },
    { id: 4, nome: "Sushiman da Cidade", categoria: "Japonesa", imagem: "🍣", status: 'Ativa' },
    { id: 5, nome: "Farmácia Central", categoria: "Saúde", imagem: "💊", status: 'Pendente' },
    { id: 6, nome: "Supermercado Econômico", categoria: "Mercado", imagem: "🛒", status: 'Ativa' },
  ]);

  const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([
    // Produtos da Pizzaria (Dono: Loja 1)
    { id: 'p1', lojaId: 1, nome: "Pizza Calabresa Familiar", preco: 45.90, descricao: "Mussarela, calabresa selecionada e cebola." },
    { id: 'p2', lojaId: 1, nome: "Pizza de Frango c/ Catupiry", preco: 49.00, descricao: "Frango desfiado com Catupiry legítimo." },
    { id: 'p3', lojaId: 1, nome: "Pizza Margherita", preco: 44.00, descricao: "Tomate, manjericão fresco e mussarela." },
    
    // Produtos da Hamburgueria (Dono: Loja 2)
    { id: 'h1', lojaId: 2, nome: "X-Bacon Supremo", preco: 28.50, descricao: "Pão brioche, blend 150g, bacon e cheddar." },
    { id: 'h2', lojaId: 2, nome: "Smash Burger Simples", preco: 19.90, descricao: "Carne smash 90g, queijo e molho especial." },
    { id: 'h3', lojaId: 2, nome: "Porção Batata G", preco: 18.00, descricao: "Batata frita super crocante com alecrim." },

    // Produtos da Doceria (Dono: Loja 3)
    { id: 'd1', lojaId: 3, nome: "Bolo de Pote Ninho", preco: 15.00, descricao: "Creme de Ninho e morangos frescos." },
    { id: 'd2', lojaId: 3, nome: "Fatia Torta Holandesa", preco: 12.50, descricao: "Creme leve e cobertura de chocolate." },
    { id: 'd3', lojaId: 3, nome: "Brigadeiro Gourmet", preco: 4.50, descricao: "Chocolate belga 50% cacau." },

    // Produtos do Japonês (Dono: Loja 4)
    { id: 'j1', lojaId: 4, nome: "Combinado 15 peças", preco: 55.00, descricao: "Sashimis, hossomakis e uramakis variados." },
    { id: 'j2', lojaId: 4, nome: "Temaki Salmão Completo", preco: 29.90, descricao: "Salmão, cream cheese e cebolinha." },
  ]);

  const [todosOsPedidos, setTodosOsPedidos] = useState<Pedido[]>([]);
  
  // --- ESTADOS TEMPORÁRIOS DE COMPRA (USADOS PELO CLIENTE) ---
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

  // --- FUNÇÕES DE LÓGICA DO SISTEMA ---

  const handleLogin = () => {
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      alert("Por favor, preencha seu login e sua senha secreta.");
      return;
    }
    // No login de teste, se os dados de perfil estiverem vazios, preenchemos com o login
    if (!usuarioNomeCompleto) setUsuarioNomeCompleto("Angelo Silvano");
    if (!usuarioUsername) setUsuarioUsername(campoLoginIdentificacao);
    setEstaLogado(true);
  };

  const handleCadastro = () => {
    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      alert("Preencha todos os campos obrigatórios para criar sua conta.");
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
      alert("O endereço de entrega é fundamental para o entregador te achar!");
      return;
    }
    
    const novoPedido: Pedido = {
      id: crypto.randomUUID(),
      lojaNome: lojaSelecionada?.nome || 'Estabelecimento PedeAí',
      clienteNome: usuarioNomeCompleto || "Cliente PedeAí",
      clienteUsername: usuarioUsername || "usuario",
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

  const mudarStatusPedidoVendedor = (id: string, novoStatus: Pedido['status']) => {
    setTodosOsPedidos(todosOsPedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p));
  };

  const cadastrarNovoProdutoVendedor = () => {
    const nome = prompt("Qual o nome do novo produto?");
    const preco = prompt("Qual o preço? (Ex: 29.90)");
    if (nome && preco) {
      const novoProduto: Produto = {
        id: crypto.randomUUID(),
        lojaId: 1, 
        nome,
        preco: parseFloat(preco.replace(',', '.')),
        descricao: "Novo item adicionado pelo lojista."
      };
      setTodosOsProdutos([...todosOsProdutos, novoProduto]);
    }
  };

  const removerProdutoVendedor = (id: string) => {
    if (confirm("Deseja realmente remover este item do seu cardápio?")) {
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

  const cardapioAtualDaLoja = todosOsProdutos.filter(p => p.lojaId === lojaSelecionada?.id);

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
      
      {/* SELETOR DE MODOS (Exclusivo para Testes do Desenvolvedor) */}
      <div className="bg-zinc-950 text-white text-[9px] p-2 flex justify-center gap-6 sticky top-0 z-50 shadow-2xl">
        <button onClick={() => setVisao('Cliente')} className={visao === 'Cliente' ? 'text-orange-400 font-black border-b-2 border-orange-400 pb-1' : 'opacity-30'}>VISÃO CLIENTE</button>
        <button onClick={() => setVisao('Vendedor')} className={visao === 'Vendedor' ? 'text-orange-400 font-black border-b-2 border-orange-400' : 'opacity-30'}>VISÃO VENDEDOR</button>
        <button onClick={() => setVisao('Admin')} className={visao === 'Admin' ? 'text-orange-400 font-black border-b-2 border-orange-400' : 'opacity-30'}>VISÃO ADMIN</button>
      </div>

      <header className="bg-orange-600 text-white p-8 text-center shadow-xl relative overflow-hidden">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">PedeAí</h1>
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.4em] mt-1">PedeAí, pediu chegou</p>
      </header>

      <main className="max-w-xl mx-auto p-5">
        
        {visao === 'Cliente' && (
          /* --- ÁREA DO CLIENTE (RF03 ao RF11) --- */
          abaAtiva === 'Inicio' ? (
            estaFinalizando ? (
              /* TELA DE CHECKOUT (FINALIZAÇÃO) */
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <button onClick={() => setEstaFinalizando(false)} className="text-orange-600 font-black flex items-center gap-2 group">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para a sacola
                </button>
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
                  <h2 className="text-xl font-black text-zinc-800 tracking-tight text-center uppercase">Finalizar compra</h2>
                  
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
                    <label className="text-[10px] font-black text-zinc-400 uppercase ml-3">Método de Pagamento</label>
                    <select 
                      className="w-full border-none p-5 rounded-3xl bg-zinc-50 outline-none focus:ring-4 ring-orange-100 font-bold appearance-none" 
                      value={formaPagamento} 
                      onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                      <option value="Dinheiro">Dinheiro na entrega</option>
                      <option value="Pix">Pix Instantâneo</option>
                      <option value="Cartão">Cartão na entrega</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t-2 border-zinc-50 flex justify-between items-center text-right">
                    <span className="text-zinc-400 font-bold uppercase text-[10px]">Total do Pedido:</span>
                    <p className="text-3xl font-black text-green-600">R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}</p>
                  </div>

                  <button onClick={realizarPedidoFinal} className="w-full bg-orange-600 text-white p-6 rounded-3xl font-black text-xl shadow-lg active:scale-95 transition-all">Pedir Agora!</button>
                </div>
              </div>
            ) : !lojaSelecionada ? (
              /* LISTAGEM DE ESTABELECIMENTOS (RF03) */
              <div className="space-y-8">
                <h2 className="font-black text-zinc-400 text-[10px] uppercase tracking-widest ml-2">Onde vamos pedir hoje?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {todasAsLojas.filter(l => l.status === 'Ativa').map(loja => (
                    <div 
                      key={loja.id} 
                      onClick={() => setLojaSelecionada(loja)} 
                      className="flex items-center bg-white p-7 rounded-[35px] shadow-sm border border-zinc-100 cursor-pointer active:scale-95 transition-all hover:shadow-lg group"
                    >
                      <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform">{loja.imagem}</div>
                      <div className="ml-6">
                        <h3 className="font-black text-base text-zinc-800 tracking-tight">{loja.nome}</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{loja.categoria} • ENTREGA EM 30 MIN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* VISUALIZAÇÃO DO CARDÁPIO (RF04, RF05) */
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <button onClick={() => setLojaSelecionada(null)} className="text-orange-600 font-black flex items-center gap-2"><span>←</span> Outros estabelecimentos</button>
                <div className="flex items-center gap-6">
                   <div className="text-6xl bg-white p-4 rounded-3xl shadow-sm border border-zinc-100">{lojaSelecionada.imagem}</div>
                   <div>
                     <h2 className="text-3xl font-black text-zinc-800 tracking-tighter leading-none">{lojaSelecionada.nome}</h2>
                     <p className="text-zinc-400 font-bold text-sm mt-1 uppercase tracking-widest">{lojaSelecionada.categoria}</p>
                   </div>
                </div>

                <div className="space-y-5">
                  {cardapioAtualDaLoja.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-zinc-50 flex justify-between items-center gap-5 transition-all hover:shadow-md">
                      <div className="flex-1">
                        <h4 className="font-black text-zinc-800 text-lg tracking-tight">{item.nome}</h4>
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
            /* LISTA DE PEDIDOS REALIZADOS (RF09, RF10) */
            <div className="space-y-8 animate-in fade-in duration-700">
              <h2 className="text-2xl font-black text-zinc-800 ml-2 tracking-tight uppercase">Meus Pedidos</h2>
              {todosOsPedidos.length === 0 ? (
                <div className="text-center py-24 text-zinc-300">
                  <p className="text-6xl mb-4">🥡</p>
                  <p className="font-black text-xl tracking-tight">Nenhum pedido ainda.</p>
                  <button onClick={() => setAbaAtiva('Inicio')} className="text-orange-600 font-black mt-4 text-lg border-b-2 border-orange-100 transition-all">Bora pedir alguma coisa?</button>
                </div>
              ) : (
                todosOsPedidos.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 space-y-4 transition-all hover:shadow-md">
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
                    <div className="flex justify-between items-center pt-2">
                       <p className="text-xl font-black text-zinc-800 tracking-tighter">R$ {p.total.toFixed(2)}</p>
                       <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-lg">{p.pagamento}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* VISÃO DO PERFIL DO CLIENTE*/
            <div className="space-y-10 text-center animate-in fade-in duration-700">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight uppercase">Meu Perfil</h2>
              <div className="bg-white p-12 rounded-[55px] shadow-sm border border-zinc-100 space-y-8 text-center relative overflow-hidden transition-all hover:shadow-md">
                <div className="w-32 h-32 bg-orange-100 rounded-[40px] flex items-center justify-center text-7xl mx-auto border-8 border-white shadow-xl shadow-orange-100">👤</div>
                <div>
                  <h3 className="font-black text-3xl text-zinc-800 tracking-tighter capitalize">
                    {usuarioNomeCompleto || 'Usuário PedeAí'}
                  </h3>
                  <p className="text-zinc-400 font-bold text-sm lowercase mt-1 tracking-wide">
                    @{usuarioUsername.toLowerCase() || 'pedeai'}
                  </p>
                  <p className="text-zinc-400 font-bold text-[10px] mt-1 italic opacity-60 tracking-widest uppercase">{usuarioEmail}</p>
                </div>
                <div className="space-y-3 pt-8 text-left">
                  <button className="w-full bg-zinc-50 text-zinc-600 p-6 rounded-[25px] font-black text-sm hover:bg-zinc-100 transition-all border border-zinc-100">Endereços Salvos</button>
                  <button className="w-full bg-zinc-50 text-zinc-600 p-6 rounded-[25px] font-black text-sm hover:bg-zinc-100 transition-all border border-zinc-100">Meus Favoritos</button>
                  <button onClick={() => setEstaLogado(false)} className="w-full text-red-500 font-black p-6 border-2 border-red-50 rounded-[25px] active:bg-red-50 shadow-sm transition-all hover:bg-red-50 mt-4 uppercase text-xs tracking-widest">Sair da Conta</button>
                </div>
              </div>
            </div>
          )
        )}

        {visao === 'Vendedor' && (
          /* --- ÁREA DO VENDEDOR --- */
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex gap-3 bg-zinc-200 p-2.5 rounded-[35px] shadow-inner">
              <button onClick={() => setAbaVendedor('Pedidos')} className={`flex-1 p-5 rounded-[25px] font-black text-xs transition-all tracking-widest ${abaVendedor === 'Pedidos' ? 'bg-white shadow-md text-orange-600' : 'text-zinc-500'}`}>VENDAS</button>
              <button onClick={() => setAbaVendedor('Cardapio')} className={`flex-1 p-5 rounded-[25px] font-black text-xs transition-all tracking-widest ${abaVendedor === 'Cardapio' ? 'bg-white shadow-md text-orange-600' : 'text-zinc-500'}`}>CARDÁPIO</button>
            </div>
            {abaVendedor === 'Pedidos' ? (
              todosOsPedidos.length === 0 ? <p className="text-center py-32 text-zinc-300 font-black italic uppercase tracking-widest">Aguardando seu primeiro pedido... 🍕</p> :
              todosOsPedidos.map(p => (
                <div key={p.id} className={`bg-white p-8 rounded-[45px] shadow-lg border-l-10 ${p.status === 'Entregue' ? 'border-zinc-300 opacity-60' : 'border-orange-500'} space-y-6 transition-all transform hover:scale-[1.02]`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-lg text-zinc-800 tracking-tighter uppercase">{p.clienteNome}</h3>
                    <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest">{p.status}</span>
                  </div>
                  <div className="bg-zinc-50 p-6 rounded-[30px] text-base font-black text-zinc-600 border border-zinc-100 italic space-y-2 shadow-inner">
                    {p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}
                  </div>
                  <p className="text-xs text-zinc-400 font-bold ml-2 italic tracking-tight uppercase">📍 Entrega: {p.endereco}</p>
                  <div className="flex gap-4 pt-2">
                    {p.status === 'Pendente' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Preparando')} className="flex-1 bg-green-600 text-white p-6 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-green-700 shadow-green-100">Aceitar</button>}
                    {p.status === 'Preparando' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Saiu para Entrega')} className="flex-1 bg-blue-600 text-white p-6 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-blue-700 shadow-blue-100">Despachar</button>}
                    {p.status === 'Saiu para Entrega' && <button onClick={() => mudarStatusPedidoVendedor(p.id, 'Entregue')} className="flex-1 bg-zinc-950 text-white p-5 rounded-[25px] font-black text-xs shadow-xl uppercase transition-all hover:bg-black">Concluir</button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-8">
                <button onClick={cadastrarNovoProdutoVendedor} className="w-full bg-orange-600 text-white p-8 rounded-[35px] font-black shadow-2xl text-xl hover:bg-orange-700 active:scale-95 transition-all uppercase tracking-widest shadow-orange-100">+ Adicionar Item</button>
                <div className="space-y-4 px-2">
                  <h3 className="font-black text-zinc-400 text-[10px] uppercase tracking-[0.3em] ml-2">Produtos Ativos no Ar</h3>
                  {todosOsProdutos.filter(p => p.lojaId === 1).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-[35px] border-2 border-zinc-100 flex justify-between items-center shadow-sm hover:border-orange-100 transition-all group">
                      <div className="flex flex-col">
                        <h4 className="font-black text-zinc-800 text-lg group-hover:text-orange-600 transition-colors tracking-tight">{p.nome}</h4>
                        <p className="text-green-600 font-black text-sm tracking-tighter mt-1 italic">R$ {p.preco.toFixed(2)}</p>
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
          /* --- ÁREA DO ADMINISTRADOR (RF20 ao RF22) --- */
          <div className="space-y-10 animate-in slide-in-from-top duration-500">
            <h2 className="text-2xl font-black text-zinc-800 text-center tracking-tighter uppercase">Painel Geral PedeAí</h2>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white p-8 rounded-[50px] shadow-sm border border-zinc-100 font-black group transition-all hover:shadow-lg">
                <p className="text-[10px] text-zinc-400 uppercase mb-2 font-black tracking-[0.2em]">Total Vendido</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter italic">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
              </div>
              <div className="bg-white p-8 rounded-[50px] shadow-sm border border-zinc-100 font-black group transition-all hover:shadow-lg">
                <p className="text-[10px] text-zinc-400 uppercase mb-2 font-black tracking-[0.2em]">Parceiros</p>
                <p className="text-3xl font-black text-orange-600 tracking-tighter">{todasAsLojas.length}</p>
              </div>
            </div>
            <div className="space-y-5 px-2">
              <h3 className="font-black text-zinc-400 text-xs uppercase ml-2 tracking-[0.3em]">Gestão de Estabelecimentos</h3>
              {todasAsLojas.map(loja => (
                <div key={loja.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-zinc-100 flex justify-between items-center transition-all hover:shadow-md">
                  <div className="flex items-center gap-5">
                    <span className="text-4xl bg-zinc-50 p-3 rounded-2xl shadow-inner">{loja.imagem}</span>
                    <div>
                      <h4 className="font-black text-base text-zinc-800 leading-none mb-1 tracking-tight">{loja.nome}</h4>
                      <p className={`text-[9px] font-black uppercase tracking-wider ${loja.status === 'Ativa' ? 'text-green-500' : 'text-red-400'}`}>{loja.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {loja.status === 'Ativa' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Bloquear')} className="bg-red-50 text-red-500 text-[9px] px-6 py-4 rounded-[20px] font-black border-2 border-red-100 uppercase tracking-tighter transition-all hover:bg-red-500 hover:text-white">Bloquear</button>}
                    {loja.status === 'Bloqueada' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="bg-zinc-950 text-white text-[9px] px-6 py-4 rounded-[20px] font-black shadow-lg uppercase tracking-widest transition-all hover:bg-black">Ativar</button>}
                    {loja.status === 'Pendente' && <button onClick={() => gerenciarLojaAdmin(loja.id, 'Aprovar')} className="bg-green-600 text-white text-[9px] px-6 py-4 rounded-[20px] font-black shadow-lg uppercase tracking-widest transition-all hover:bg-green-700">Aprovar</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MENU INFERIOR FIXO PARA O CLIENTE (NAVEGAÇÃO TIPO APP) */}
      {visao === 'Cliente' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-5 flex justify-around max-w-xl mx-auto z-50 rounded-t-[45px] shadow-2xl">
          <button 
            onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); }} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-2xl transition-all">🏠</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Bora</span>
          </button>
          
          <button 
            onClick={() => setAbaAtiva('Pedidos')} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${abaAtiva === 'Pedidos' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-2xl transition-all">📋</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Pedidos</span>
          </button>
          
          <button 
            onClick={() => setAbaAtiva('Perfil')} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${abaAtiva === 'Perfil' ? 'text-orange-600 scale-105' : 'text-zinc-300'}`}
          >
            <span className="text-2xl transition-all">👤</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Eu</span>
          </button>
        </nav>
      )}

      {/* BARRA FLUTUANTE DE CARRINHO (SÓ APARECE SE HOUVER ITENS NA SACOLA) */}
      {visao === 'Cliente' && abaAtiva === 'Inicio' && !estaFinalizando && carrinho.length > 0 && (
        <div className="fixed bottom-32 left-6 right-6 max-w-md mx-auto z-40 animate-in slide-in-from-bottom duration-600">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="w-full bg-green-600 text-white p-6 rounded-[35px] font-black shadow-2xl flex justify-between items-center active:scale-95 transition-all ring-4 ring-white shadow-green-100"
          >
            <div className="flex items-center gap-3">
               <div className="bg-green-700 w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-inner border border-green-500 font-black tracking-tighter italic">🛒</div>
               <div className="text-left leading-none">
                 <span className="text-[10px] font-black tracking-widest uppercase opacity-70">Finalizar compra</span>
                 <p className="text-base font-black tracking-tighter mt-1 uppercase">{carrinho.length} ITENS NA SACOLA</p>
               </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black tracking-tighter italic">R$ {carrinho.reduce((s, i) => s + i.preco, 0).toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;