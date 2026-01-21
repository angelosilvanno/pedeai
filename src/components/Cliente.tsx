import React, { useState, useMemo } from 'react'
import { 
  Home, 
  ClipboardList, 
  User, 
  Search, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  ChevronRight, 
  LogOut, 
  Clock,
  Trash2,
  X,
  QrCode,
  CreditCard,
  CheckCircle2,
  Wallet,
  Banknote,
  UtensilsCrossed,
  Star
} from 'lucide-react'
import type { Loja, Produto, Pedido } from '../types'

interface ClienteProps {
  todasAsLojas: Loja[];
  todosOsProdutos: Produto[];
  todosOsPedidos: Pedido[];
  setTodosOsPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
  usuarioTelefone: string;
  usuarioNomeCompleto: string;
  usuarioUsername: string;
  usuarioEmail: string;
  handleLogout: () => void;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
  getStoreIcon: (iconName: string) => React.ReactNode;
}

export default function Cliente({ 
  todasAsLojas, 
  todosOsProdutos, 
  todosOsPedidos, 
  setTodosOsPedidos, 
  usuarioTelefone,
  usuarioNomeCompleto, 
  usuarioUsername, 
  usuarioEmail, 
  handleLogout, 
  notify, 
  getStoreIcon 
}: ClienteProps) {
  const [abaAtiva, setAbaAtiva] = useState<'Inicio' | 'Pedidos' | 'Perfil'>('Inicio');
  const [busca, setBusca] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [estaFinalizando, setEstaFinalizando] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  
  const [dadosCartao, setDadosCartao] = useState({ 
    numero: '', 
    nome: '', 
    validade: '', 
    cvv: '' 
  });

  const [gerenciandoEnderecos, setGerenciandoEnderecos] = useState(false);
  const [meusEnderecos, setMeusEnderecos] = useState<{
    id: string, 
    titulo: string, 
    rua: string, 
    numero: string, 
    bairro: string
  }[]>([
    { id: '1', titulo: 'Casa', rua: '', numero: '', bairro: '' },
    { id: '2', titulo: 'Trabalho', rua: '', numero: '', bairro: '' }
  ]);

  const [modalEndereco, setModalEndereco] = useState<{
    aberto: boolean, 
    id: string, 
    titulo: string
  }>({
    aberto: false,
    id: '',
    titulo: ''
  });
  const [tempRua, setTempRua] = useState('');
  const [tempNumero, setTempNumero] = useState('');

  const estaAberto = (abertura: string, fechamento: string) => {
    try {
      const agora = new Date();
      const horaAtual = agora.getHours() * 60 + agora.getMinutes();
      const [hA, mA] = (abertura || "00:00").split(':').map(Number);
      const [hF, mF] = (fechamento || "23:59").split(':').map(Number);
      const minA = hA * 60 + mA;
      const minF = hF * 60 + mF;
      return horaAtual >= minA && horaAtual <= minF;
    } catch {
      return false;
    }
  };

  const lojasFiltradas = useMemo(() => {
    return (todasAsLojas || []).filter(l => 
      l?.status === 'Ativa' && 
      l?.nome?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, todasAsLojas]);
  
  const cardapioParaExibir = useMemo(() => {
    if (!lojaSelecionada || !todosOsProdutos) return [];
    
    return todosOsProdutos.filter(p => {
      const idProd = String(p.lojaId || (p as { loja_id?: string }).loja_id || '');
      const idLoja = String(lojaSelecionada.id || '');
      return idProd === idLoja && idProd !== '';
    });
  }, [lojaSelecionada, todosOsProdutos]);
  
  const totalCarrinho = useMemo(() => 
    carrinho.reduce((acc, item) => acc + (Number(item?.preco) || 0), 0)
  , [carrinho]);

  const realizarPedidoFinal = () => {
    if (carrinho.length === 0) return;

    const enderecoFinal = novoEndereco.trim() || enderecoEntrega;
    if (!enderecoFinal || enderecoFinal.includes("não definido")) {
      return notify("Por favor, informe o endereço completo.", 'erro');
    }

    if (formaPagamento.includes("Cartão") && (!dadosCartao.numero || !dadosCartao.cvv)) {
      return notify("Preencha os dados do cartão.", 'erro');
    }

    if (!lojaSelecionada) return notify("Erro: Estabelecimento não selecionado.", 'erro');
    
    const idPedido = crypto.randomUUID();

    const novoPedido: Pedido = {
      id: idPedido,
      lojaNome: lojaSelecionada.nome,
      clienteNome: usuarioNomeCompleto,
      clienteUsername: usuarioUsername,
      itens: [...carrinho],
      total: totalCarrinho,
      endereco: enderecoFinal,
      pagamento: formaPagamento,
      status: 'Pendente'
    };

    setTodosOsPedidos((prev) => [novoPedido, ...prev]);
    
    setCarrinho([]);
    setEstaFinalizando(false);
    setLojaSelecionada(null);
    setAbaAtiva('Pedidos');
    setNovoEndereco('');
    setEnderecoEntrega('');
    setDadosCartao({ numero: '', nome: '', validade: '', cvv: '' });
    
    notify("Pedido enviado com sucesso!");
  };

  const salvarEnderecoModal = () => {
    if (!tempRua || !tempNumero) return notify("Preencha todos os campos", "erro");

    setMeusEnderecos(prev => prev.map(e => e.id === modalEndereco.id ? { ...e, rua: tempRua, numero: tempNumero } : e));
    const enderecoCompleto = `${tempRua}, ${tempNumero} - ${modalEndereco.titulo}`;
    setEnderecoEntrega(enderecoCompleto);
    setNovoEndereco('');
    
    setModalEndereco({ aberto: false, id: '', titulo: '' });
    setTempRua('');
    setTempNumero('');
    notify(`${modalEndereco.titulo} atualizado!`);
  };

  const abrirModalParaNovo = () => {
    const novoId = crypto.randomUUID();
    setModalEndereco({ aberto: true, id: novoId, titulo: 'Novo Local' });
    setMeusEnderecos([...meusEnderecos, { id: novoId, titulo: 'Novo Local', rua: '', numero: '', bairro: '' }]);
  };

  const removerEndereco = (id: string) => {
    setMeusEnderecos(meusEnderecos.filter(e => e.id !== id));
    notify("Endereço removido.");
  };

  return (
    <div className="min-h-screen pb-44 bg-[#F8F9FA] font-sans text-zinc-900">
      
      {modalEndereco.aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-4xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Definir {modalEndereco.titulo}</h2>
              <button 
                onClick={() => setModalEndereco({aberto: false, id: '', titulo: ''})} 
                className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Rua / Avenida</label>
                <input 
                  type="text" 
                  value={tempRua} 
                  onChange={(e) => setTempRua(e.target.value)}
                  placeholder="Ex: Rua das Flores"
                  className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none font-semibold focus:border-orange-500 shadow-inner text-zinc-900 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Número</label>
                <input 
                  type="text" 
                  value={tempNumero} 
                  onChange={(e) => setTempNumero(e.target.value)}
                  placeholder="Ex: 123 ou S/N"
                  className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none font-semibold focus:border-orange-500 shadow-inner text-zinc-900 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={salvarEnderecoModal}
              className="w-full mt-6 py-4 bg-orange-600 text-white rounded-2xl font-bold text-base active:scale-95 transition-all shadow-lg shadow-orange-100"
            >
              Confirmar Local
            </button>
          </div>
        </div>
      )}

      {abaAtiva === 'Inicio' ? (
        estaFinalizando ? (
          <div className="p-4 max-w-xl mx-auto space-y-4 animate-in slide-in-from-right duration-500">
            <header className="flex items-center gap-3 py-3">
              <button onClick={() => setEstaFinalizando(false)} className="bg-white p-2 rounded-xl shadow-sm border border-zinc-200 text-orange-600 active:scale-90 transition-all">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-zinc-950 tracking-tight leading-none">Checkout</h1>
            </header>

            <section className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200">
              <div className="flex items-center gap-2 mb-4">
                 <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                    <MapPin size={16} />
                 </div>
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Endereço de Entrega</h3>
              </div>
              
              <div className="space-y-2">
                {meusEnderecos.map((end) => (
                  <button
                    key={end.id}
                    onClick={() => {
                      if (!end.rua) {
                        setModalEndereco({ aberto: true, id: end.id, titulo: end.titulo });
                      } else {
                        setEnderecoEntrega(`${end.rua}, ${end.numero} - ${end.titulo}`);
                        setNovoEndereco('');
                      }
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${enderecoEntrega.includes(end.titulo) && !novoEndereco ? "border-orange-600 bg-orange-50/50 shadow-inner" : "border-zinc-200 bg-zinc-50"}`}
                  >
                    <Home size={18} className={enderecoEntrega.includes(end.titulo) && !novoEndereco ? "text-orange-600" : "text-zinc-500"} />
                    <div className="text-left flex-1">
                      <p className="font-bold text-sm text-zinc-950 leading-none">{end.titulo}</p>
                      <p className="text-[11px] text-zinc-600 font-medium mt-1.5 leading-none italic">
                        {end.rua ? `${end.rua}, ${end.numero}` : "Toque para definir endereço"}
                      </p>
                    </div>
                    {enderecoEntrega.includes(end.titulo) && !novoEndereco && <CheckCircle2 size={18} className="text-orange-600 animate-in zoom-in" />}
                  </button>
                ))}
                
                <input
                  type="text"
                  placeholder="Outro endereço para agora..."
                  value={novoEndereco}
                  onChange={(e) => { setNovoEndereco(e.target.value); setEnderecoEntrega(''); }}
                  className="w-full p-4 rounded-2xl bg-zinc-100 border-2 border-transparent focus:border-orange-500 outline-none text-xs font-bold text-zinc-900 shadow-inner transition-all placeholder:text-zinc-400"
                />
              </div>
            </section>

            <section className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200">
              <div className="flex items-center gap-2 mb-4">
                 <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                    <Wallet size={16} />
                 </div>
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Método de Pagamento</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'Dinheiro', icon: <Banknote size={20} /> },
                  { id: 'Pix', icon: <QrCode size={20} /> },
                  { id: 'Cartão de Crédito', icon: <CreditCard size={20} /> },
                  { id: 'Cartão de Débito', icon: <CreditCard size={20} /> }
                ].map((metodo) => (
                  <button
                    key={metodo.id}
                    onClick={() => setFormaPagamento(metodo.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formaPagamento === metodo.id ? "border-green-600 bg-green-50/50" : "border-zinc-200 bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-3 text-zinc-900">
                      <span className={formaPagamento === metodo.id ? "text-green-600" : "text-zinc-500"}>{metodo.icon}</span>
                      <span className="font-bold text-sm">{metodo.id}</span>
                    </div>
                    {formaPagamento === metodo.id && <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-sm" />}
                  </button>
                ))}
              </div>

              {formaPagamento === 'Pix' && (
                <div className="mt-4 p-8 bg-zinc-950 rounded-3xl text-center animate-in zoom-in duration-300">
                  <div className="bg-white p-3 rounded-2xl inline-block mb-3 shadow-xl border-4 border-zinc-800">
                    <QrCode size={100} className="text-zinc-900" />
                  </div>
                  <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-3">Pague agora para agilizar sua entrega</p>
                  <button onClick={() => notify("Código Pix Copiado!")} className="w-full bg-zinc-800 text-white p-3 rounded-xl text-[9px] font-bold uppercase active:scale-95 transition-all border border-zinc-700">Copiar Chave Pix</button>
                </div>
              )}

              {formaPagamento.includes('Cartão') && (
                <div className="mt-4 space-y-3 animate-in slide-in-from-top-4 duration-300 px-1">
                  <input 
                    type="text" 
                    placeholder="Número do Cartão"
                    className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-200 outline-none font-bold text-sm shadow-inner text-zinc-900 placeholder:text-zinc-400"
                    value={dadosCartao.numero}
                    onChange={(e) => setDadosCartao({...dadosCartao, numero: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/AA" className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 outline-none font-bold text-sm text-center shadow-inner text-zinc-900 placeholder:text-zinc-400" value={dadosCartao.validade} onChange={(e) => setDadosCartao({...dadosCartao, validade: e.target.value})} />
                    <input type="text" placeholder="CVV" className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 outline-none font-bold text-sm text-center shadow-inner text-zinc-900 placeholder:text-zinc-400" value={dadosCartao.cvv} onChange={(e) => setDadosCartao({...dadosCartao, cvv: e.target.value})} />
                  </div>
                </div>
              )}
            </section>

            <section className="bg-zinc-950 p-6 rounded-4xl shadow-2xl text-white">
              <div className="space-y-2 mb-5 px-1">
                {carrinho.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-zinc-500 italic">1x {item.nome}</span>
                    <span className="text-zinc-100">R$ {Number(item.preco).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-end px-1">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total a pagar</p>
                  <p className="text-3xl font-black text-orange-500 italic tracking-tighter leading-none">R$ {totalCarrinho.toFixed(2)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-green-500 uppercase italic leading-none mb-1">Taxa de Entrega</p>
                   <p className="text-sm font-bold text-zinc-100 uppercase tracking-tighter">Grátis</p>
                </div>
              </div>
            </section>

            <button 
              onClick={realizarPedidoFinal}
              disabled={(!enderecoEntrega && !novoEndereco)}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 mb-10 ${ (enderecoEntrega || novoEndereco) ? "bg-orange-600 text-white shadow-orange-200/50" : "bg-zinc-300 text-zinc-500 cursor-not-allowed"}`}
            >
              Confirmar Pedido!
            </button>
          </div>
        ) : !lojaSelecionada ? (
          <div className="animate-in fade-in duration-300">
            <header className="p-5 border-b border-zinc-200 flex items-center justify-between sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-100 transition-transform active:scale-95">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Entregar em</p>
                  <p className="text-sm font-bold text-zinc-950 truncate max-w-45 mt-1.5 leading-none">
                    {enderecoEntrega || "Definir endereço..."}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 bg-zinc-950 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
                {usuarioNomeCompleto.charAt(0)}
              </div>
            </header>

            <div className="p-4 space-y-8">
              <div className="relative group px-1">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="O que vamos pedir hoje?" 
                  className="w-full rounded-2xl bg-white py-4 pl-12 pr-4 text-sm font-bold shadow-sm border border-zinc-200 outline-none focus:ring-4 ring-orange-50/50 text-zinc-950 placeholder:text-zinc-400 transition-all" 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)} 
                />
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 px-1">
                {[
                  { n: 'Pizzas', i: '🍕' },
                  { n: 'Lanches', i: '🍔' },
                  { n: 'Japonesa', i: '🍣' },
                  { n: 'Doces', i: '🍩' },
                  { n: 'Açaí', i: '🍇' }
                ].map(cat => (
                  <button key={cat.n} className="flex flex-col items-center gap-2 min-w-18.75 group active:scale-90 transition-transform">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border border-zinc-200 group-hover:border-orange-200 group-hover:shadow-lg transition-all">
                      {cat.i}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-tight">{cat.n}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 px-1">
                <h2 className="text-lg font-black flex items-center gap-2 text-zinc-950 ml-1">Destaques da Cidade <UtensilsCrossed size={16} className="text-orange-500" /></h2>
                {lojasFiltradas.map(loja => {
                  const aberto = estaAberto(loja.abertura || "00:00", loja.fechamento || "23:59");
                  return (
                    <div key={loja.id} onClick={() => setLojaSelecionada(loja)} className="relative flex items-center rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group active:scale-[0.98]">
                      <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${aberto ? 'bg-green-500 shadow-md shadow-green-100' : 'bg-zinc-300'}`}></div>
                      <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 group-hover:bg-orange-50 transition-colors shadow-inner overflow-hidden">
                        {getStoreIcon(loja.imagem)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-950 text-sm leading-none">{loja.nome}</h3>
                          <span className="flex items-center gap-0.5 text-orange-600 font-bold text-[10px] bg-orange-50 px-1.5 py-0.5 rounded-full"><Star size={10} fill="currentColor" /> 5.0</span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-1.5 leading-none">{loja.categoria}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shadow-sm ${aberto ? 'text-green-600 bg-green-50' : 'text-zinc-600 bg-zinc-100'}`}>
                            {aberto ? 'Aberto' : 'Fechado'}
                          </span>
                          <span className="text-[10px] text-zinc-700 font-bold flex items-center gap-1 leading-none">
                            <Clock size={12} className="text-zinc-500" /> 
                            {loja.abertura} - {loja.fechamento}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 animate-in fade-in duration-300">
            <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-orange-600 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl mb-6 shadow-sm active:scale-95 transition-all">
              <ArrowLeft size={16} /> Voltar aos estabelecimentos
            </button>
            
            <div className="flex items-center gap-4 mb-8 px-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm h-20 w-20 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                  {getStoreIcon(lojaSelecionada?.imagem || '')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-950 leading-tight tracking-tight">{lojaSelecionada?.nome}</h2>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">{lojaSelecionada?.categoria}</p>
                  <div className="flex items-center gap-2 mt-2.5 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-md w-fit shadow-sm">
                    <Clock size={14} /> <span>{lojaSelecionada?.abertura} - {lojaSelecionada?.fechamento}</span>
                  </div>
                </div>
            </div>

            <div className="space-y-3 px-1">
              {cardapioParaExibir.length === 0 ? (
                <div className="text-center py-16">
                   <ShoppingBag size={48} className="mx-auto text-zinc-100 mb-4" />
                   <p className="text-zinc-400 font-bold uppercase text-[11px] tracking-widest">Nenhum produto cadastrado</p>
                </div>
              ) : (
                cardapioParaExibir.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-all group active:bg-zinc-50/50">
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 text-sm tracking-tight">{item.nome}</h4>
                      <p className="text-xs text-zinc-600 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {item.descricao}
                      </p>
                      <p className="mt-2.5 font-bold text-green-600 text-sm tracking-tight bg-green-50 w-fit px-2 py-0.5 rounded-md shadow-inner border border-green-100">
                        R$ {(Number(item.preco) || 0).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => { setCarrinho([...carrinho, item]); notify(`${item.nome} na sacola!`); }} 
                      className="flex h-10 w-10 rounded-xl bg-orange-600 text-white items-center justify-center shadow-lg active:scale-90 transition-all shadow-orange-100"
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      ) : abaAtiva === 'Pedidos' ? (
        <div className="p-5 space-y-6 animate-in fade-in duration-300">
          <h2 className="text-2xl font-black text-zinc-950 ml-1">Meus pedidos</h2>
          {todosOsPedidos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200 shadow-inner">
              <ClipboardList size={40} className="mx-auto text-zinc-200 mb-3" />
              <p className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest leading-none">Nenhum pedido realizado</p>
            </div>
          ) : (
            todosOsPedidos.map((p: Pedido & { loja_nome?: string; lo_nome?: string }) => (
              <div key={p.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm mb-4 border-l-4 border-l-orange-600 relative transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 text-zinc-950">
                    <h3 className="font-black text-base leading-none mb-2 tracking-tight">
                      {p.lojaNome || p.lo_nome || p.loja_nome || 'Estabelecimento'}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                      PEDIDO #{String(p.id).split('-')[0]}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-600' : 'bg-orange-600 text-white animate-pulse'}`}>
                    {p.status}
                  </span>
                </div>
                
                <div className="bg-zinc-50 rounded-xl p-4 text-xs text-zinc-700 border border-zinc-200 font-bold mb-4 leading-relaxed italic shadow-inner">
                  {p.itens?.map(i => i.nome).join(', ')}
                </div>

                <div className="flex justify-between items-end border-t border-zinc-100 pt-4 px-1">
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-black mb-1 tracking-widest leading-none">Total Pago</p>
                      <p className="text-xl font-black text-zinc-950 italic tracking-tighter leading-none">R$ {(Number(p.total) || 0).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-1 justify-end text-zinc-700 mb-1.5 font-bold">
                          <CreditCard size={12} className="text-zinc-500" />
                          <p className="text-[9px] uppercase font-black leading-none tracking-widest">{p.pagamento}</p>
                       </div>
                       <p className="text-[10px] text-zinc-500 font-bold max-w-30 leading-tight truncate italic">
                         {p.endereco}
                       </p>
                    </div>
                </div>
              </div>
            ))
          )
          }
        </div>
      ) : (
        <div className="p-5 animate-in fade-in duration-300">
          {gerenciandoEnderecos ? (
            <div className="space-y-6">
                <button onClick={() => setGerenciandoEnderecos(false)} className="flex items-center gap-2 font-bold text-[10px] uppercase text-orange-600 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all"><ArrowLeft size={16} /> Perfil</button>
                <h2 className="text-2xl font-bold text-zinc-950 ml-1 tracking-tight">Endereços</h2>
                
                <button 
                  onClick={abrirModalParaNovo}
                  className="w-full bg-white text-zinc-400 p-8 rounded-3xl font-bold uppercase text-[10px] tracking-widest border-2 border-dashed border-zinc-200 active:scale-95 transition-all shadow-sm flex flex-col items-center gap-3 group"
                >
                  <Plus size={22} className="text-zinc-300 group-hover:text-orange-500 transition-colors" />
                  Adicionar Novo Local
                </button>

                <div className="space-y-3">
                  {meusEnderecos.map((end) => (
                    <div key={end.id} className="bg-white p-5 rounded-[22px] border border-zinc-200 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 shadow-inner group-hover:bg-orange-50 transition-colors"><MapPin size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-zinc-950 leading-none">{end.titulo}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1.5 tracking-widest leading-none truncate max-w-44 italic">{end.rua ? `${end.rua}, ${end.numero}` : "Endereço não definido"}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => setModalEndereco({ aberto: true, id: end.id, titulo: end.titulo })} className="p-2.5 text-orange-600 bg-orange-50 rounded-xl active:scale-90 transition-all shadow-sm"><Plus size={18} /></button>
                        {end.id !== '1' && end.id !== '2' && <button onClick={() => removerEndereco(end.id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl active:scale-90 transition-all shadow-sm"><Trash2 size={18} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center gap-5 py-12 bg-white -mx-5 px-8 rounded-b-[40px] shadow-sm border-b border-zinc-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="h-16 w-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-orange-100 relative z-10 border-2 border-white overflow-hidden active:rotate-12 transition-transform">
                  {usuarioNomeCompleto.charAt(0)}
                </div>
                <div className="flex-1 relative z-10">
                  <h2 className="text-xl font-black text-zinc-950 leading-none italic tracking-tight">{usuarioNomeCompleto}</h2>
                  <p className="text-zinc-600 text-sm mt-1.5 font-black leading-none">@{usuarioUsername}</p>
                  
                  <div className="mt-4 space-y-0.5">
                    <p className="text-zinc-700 text-[11px] font-bold tracking-tight">{usuarioEmail}</p>
                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{usuarioTelefone}</p>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-5 flex items-center gap-1.5 text-red-600 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-sm px-3.5 py-2 bg-red-50 border border-red-100 rounded-xl leading-none">
                    <LogOut size={12} /> Encerrar Sessão
                  </button>
                </div>
              </div>

              <div className="space-y-2 px-2">
                <h3 className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em] ml-4 mb-3">Configurações</h3>
                
                <button onClick={() => setGerenciandoEnderecos(true)} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm active:scale-95 group transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-600 transition-colors">
                        <MapPin size={20} className="text-orange-600 group-hover:text-white transition-colors" />
                     </div>
                     <span className="font-bold text-sm text-zinc-800 tracking-tight leading-none">Meus Endereços</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-500" />
                </button>

                <button onClick={() => setAbaAtiva('Pedidos')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm active:scale-95 group transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-600 transition-colors">
                        <ClipboardList size={20} className="text-orange-600 group-hover:text-white transition-colors" />
                     </div>
                     <span className="font-bold text-sm text-zinc-800 tracking-tight leading-none">Histórico de Pedidos</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-xl bg-white/95 backdrop-blur-md border-t border-zinc-200 p-5 flex justify-around rounded-t-4xl shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        {[
          { id: 'Inicio', i: <Home size={22} />, l: 'Início' },
          { id: 'Pedidos', i: <ClipboardList size={22} />, l: 'Pedidos' },
          { id: 'Perfil', i: <User size={22} />, l: 'Perfil' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => { setAbaAtiva(item.id as 'Inicio' | 'Pedidos' | 'Perfil'); setLojaSelecionada(null); setEstaFinalizando(false); setGerenciandoEnderecos(false); }} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${abaAtiva === item.id ? 'text-orange-600 font-black scale-110' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            {item.i}
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{item.l}</span>
            {abaAtiva === item.id && <div className="w-1 h-1 bg-orange-600 rounded-full mt-1 animate-pulse" />}
          </button>
        ))}
      </nav>
      
      {abaAtiva === 'Inicio' && carrinho.length > 0 && !estaFinalizando && (
        <div className="fixed bottom-28 left-5 right-5 z-40 mx-auto max-w-md animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="w-full bg-zinc-950 text-white p-5 rounded-[28px] font-black shadow-2xl flex justify-between items-center active:scale-95 transition-all ring-4 ring-white/50 group overflow-hidden relative"
          >
            <div className="flex items-center gap-4 relative z-10">
                <div className="h-11 w-11 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                  <ShoppingBag size={22} className="text-white" />
                </div>
                <div className="text-left leading-none">
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1.5 italic">Minha Sacola</p>
                  <p className="text-sm font-black uppercase tracking-tight">
                    {carrinho.length} {carrinho.length === 1 ? 'Produto' : 'Produtos'}
                  </p>
                </div>
            </div>
            <div className="text-right relative z-10">
              <span className="text-2xl font-black italic text-orange-500 tracking-tighter">
                R$ {totalCarrinho.toFixed(2)}
              </span>
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      )}
    </div>
  );
}