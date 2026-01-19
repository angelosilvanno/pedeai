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
  X
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
  
  const [gerenciandoEnderecos, setGerenciandoEnderecos] = useState(false);
  const [meusEnderecos, setMeusEnderecos] = useState<{id: string, titulo: string, rua: string, numero: string, bairro: string}[]>([
    { id: '1', titulo: 'Casa', rua: '', numero: '', bairro: '' },
    { id: '2', titulo: 'Trabalho', rua: '', numero: '', bairro: '' }
  ]);

  const [modalEndereco, setModalEndereco] = useState<{aberto: boolean, id: string, titulo: string}>({
    aberto: false,
    id: '',
    titulo: ''
  });
  const [tempRua, setTempRua] = useState('');
  const [tempNumero, setTempNumero] = useState('');

  const estaAberto = (abertura: string, fechamento: string) => {
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const [hA, mA] = abertura.split(':').map(Number);
    const [hF, mF] = fechamento.split(':').map(Number);
    const minA = hA * 60 + mA;
    const minF = hF * 60 + mF;
    return horaAtual >= minA && horaAtual <= minF;
  };

  const lojasFiltradas = useMemo(() => todasAsLojas.filter(l => l.status === 'Ativa' && l.nome.toLowerCase().includes(busca.toLowerCase())), [busca, todasAsLojas]);
  
  const cardapioParaExibir = useMemo(() => todosOsProdutos.filter(p => String(p.lojaId) === String(lojaSelecionada?.id)), [lojaSelecionada, todosOsProdutos]);
  
  const totalCarrinho = useMemo(() => carrinho.reduce((acc, item) => acc + item.preco, 0), [carrinho]);

  const realizarPedidoFinal = () => {
    const enderecoFinal = novoEndereco.trim() || enderecoEntrega;
    if (!enderecoFinal || enderecoFinal.includes("não definido")) return notify("Por favor, informe o endereço completo.", 'erro');
    if (!lojaSelecionada) return notify("Erro: Loja não selecionada.", 'erro');
    
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

    setTodosOsPedidos((prev) => {
      const jaExiste = prev.find(p => p.id === idPedido);
      if (jaExiste) return prev;
      return [novoPedido, ...prev];
    });
    
    setCarrinho([]);
    setEstaFinalizando(false);
    setLojaSelecionada(null);
    setAbaAtiva('Pedidos');
    setNovoEndereco('');
    setEnderecoEntrega('');
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
    <div className="min-h-screen pb-44 bg-zinc-50">
      
      {modalEndereco.aberto && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Onde é seu {modalEndereco.titulo}?</h2>
              <button onClick={() => setModalEndereco({aberto: false, id: '', titulo: ''})} className="p-2 bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Rua / Avenida</label>
                <input 
                  type="text" 
                  value={tempRua} 
                  onChange={(e) => setTempRua(e.target.value)}
                  placeholder="Ex: Rua das Flores"
                  className="w-full p-5 mt-1 rounded-[25px] bg-zinc-50 border-2 border-zinc-50 focus:border-orange-200 outline-none font-bold text-zinc-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Número</label>
                <input 
                  type="text" 
                  value={tempNumero} 
                  onChange={(e) => setTempNumero(e.target.value)}
                  placeholder="Ex: 123 ou S/N"
                  className="w-full p-5 mt-1 rounded-[25px] bg-zinc-50 border-2 border-zinc-50 focus:border-orange-200 outline-none font-bold text-zinc-800"
                />
              </div>
            </div>

            <button 
              onClick={salvarEnderecoModal}
              className="w-full mt-8 py-5 bg-orange-600 text-white rounded-[25px] font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all"
            >
              Confirmar Local
            </button>
          </div>
        </div>
      )}

      {abaAtiva === 'Inicio' ? (
        estaFinalizando ? (
          <div className="animate-in slide-in-from-right p-4 max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] border border-zinc-100 shadow-sm">
              <button onClick={() => setEstaFinalizando(false)} className="text-orange-600 p-2 hover:bg-orange-50 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-black text-zinc-800">Finalizar Pedido</h1>
            </div>

            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Onde entregar?</h3>
              <div className="space-y-3">
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
                    className={`w-full flex items-start gap-4 p-4 rounded-[25px] border-2 transition-all ${enderecoEntrega.includes(end.titulo) && !novoEndereco ? "border-orange-500 bg-orange-50" : "border-zinc-50 bg-zinc-50"}`}
                  >
                    <div className={`mt-1 ${enderecoEntrega.includes(end.titulo) && !novoEndereco ? "text-orange-500" : "text-zinc-300"}`}>
                      <MapPin size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-zinc-800 text-sm leading-none">{end.titulo}</p>
                      <p className="text-xs text-zinc-500 mt-1.5 leading-tight">
                        {end.rua ? `${end.rua}, ${end.numero}` : "Clique para definir o endereço"}
                      </p>
                    </div>
                  </button>
                ))}
                <div className="pt-2">
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3 ml-2">Ou estou em um local novo</p>
                  <input
                    type="text"
                    placeholder="Rua, número, bairro..."
                    value={novoEndereco}
                    onChange={(e) => { setNovoEndereco(e.target.value); setEnderecoEntrega(''); }}
                    className="w-full p-5 rounded-[25px] bg-zinc-50 border-2 border-zinc-50 focus:border-orange-200 focus:bg-white outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Forma de Pagamento</h3>
              <select 
                className="w-full p-5 rounded-[25px] bg-zinc-50 border-2 border-zinc-50 outline-none font-black text-zinc-800"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
              </select>
            </div>

            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-zinc-800">Total</span>
                <span className="text-3xl font-black text-green-600 italic tracking-tighter">R$ {totalCarrinho.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 pb-10">
                <button 
                onClick={realizarPedidoFinal}
                disabled={(!enderecoEntrega && !novoEndereco)}
                className={`w-full py-6 rounded-[30px] font-black text-xl shadow-xl transition-all active:scale-95 ${ (enderecoEntrega || novoEndereco) ? "bg-orange-600 text-white" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"}`}
                >
                Confirmar Agora!
                </button>
            </div>
          </div>
        ) : !lojaSelecionada ? (
          <div className="space-y-8 p-4">
            <div className="bg-zinc-50 -mx-5 px-5 py-5 border-b border-zinc-100/50">
              <div className="relative group max-w-xl mx-auto">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="O que vamos pedir hoje?" 
                  className="w-full rounded-full bg-white py-4.5 pl-14 pr-8 text-base font-bold shadow-sm border border-zinc-100 outline-none transition-all focus:ring-4 ring-orange-50 focus:border-orange-100 placeholder:text-zinc-300" 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid gap-5">
              {lojasFiltradas.map(loja => {
                const aberto = estaAberto(loja.abertura || "00:00", loja.fechamento || "23:59");
                return (
                  <div key={loja.id} onClick={() => setLojaSelecionada(loja)} className="group relative flex items-center rounded-[35px] border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${aberto ? 'bg-green-500' : 'bg-zinc-200'}`}></div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 group-hover:bg-orange-50 transition-colors">{getStoreIcon(loja.imagem)}</div>
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-black text-zinc-800 tracking-tight leading-none">{loja.nome}</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{loja.categoria}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${aberto ? 'text-green-600 bg-green-50' : 'text-zinc-400 bg-zinc-100'}`}>
                          {aberto ? 'Aberto' : 'Fechado'}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1 leading-none">
                          <Clock size={10} /> {loja.abertura} - {loja.fechamento}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-zinc-50 text-zinc-300 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-8 p-4 animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full transition-all w-fit"><ArrowLeft size={16} /> Voltar para as lojas</button>
            <div className="flex items-center gap-6">
                <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">{getStoreIcon(lojaSelecionada.imagem)}</div>
                <h2 className="text-3xl font-black text-zinc-800 tracking-tighter leading-none">{lojaSelecionada.nome}</h2>
            </div>
            <div className="space-y-4">
              {cardapioParaExibir.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-5 rounded-[35px] border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-zinc-800 tracking-tight">{item.nome}</h4>
                    <p className="my-1 text-xs text-zinc-400 leading-relaxed">{item.descricao}</p>
                    <p className="mt-1 text-lg font-black text-green-600 tracking-tighter">R$ {item.preco.toFixed(2)}</p>
                  </div>
                  <button onClick={() => { setCarrinho([...carrinho, item]); notify(`${item.nome} na sacola!`); }} className="flex h-12 w-12 rounded-2xl bg-orange-600 text-white items-center justify-center shadow-lg active:scale-90 transition-all"><Plus size={24} /></button>
                </div>
              ))}
            </div>
          </div>
        )
      ) : abaAtiva === 'Pedidos' ? (
        <div className="space-y-8 p-4 animate-in fade-in">
          <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">Meus pedidos</h2>
          {todosOsPedidos.length === 0 ? <p className="text-center py-20 font-bold opacity-30 uppercase">Nenhum pedido realizado ainda</p> :
            todosOsPedidos.map(p => (
              <div key={p.id} className="rounded-[40px] border border-zinc-100 bg-white p-8 shadow-sm mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-zinc-800 tracking-tight leading-none">{p.lojaNome}</h3>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-500' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{p.status}</span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 text-xs font-medium text-zinc-500 leading-relaxed">{p.itens.map(i => i.nome).join(', ')}</div>
                <div className="mt-4 pt-4 border-t border-zinc-50 flex justify-between font-black items-center">
                    <p className="text-2xl italic tracking-tighter text-zinc-800 leading-none">R$ {p.total.toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{p.pagamento}</p>
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="p-4 animate-in fade-in duration-500">
          {gerenciandoEnderecos ? (
            <div className="space-y-8 animate-in slide-in-from-right">
                <button onClick={() => setGerenciandoEnderecos(false)} className="flex items-center gap-2 font-bold text-orange-600"><ArrowLeft size={16} /> Voltar ao Perfil</button>
                <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">Meus Endereços</h2>
                
                <button 
                 onClick={abrirModalParaNovo}
                 className="w-full bg-orange-50 text-orange-600 p-6 rounded-[30px] font-black uppercase text-xs flex items-center justify-center gap-3 border-2 border-dashed border-orange-200 active:scale-95 transition-all"
                >
                  <Plus size={20} /> Adicionar Novo Local
                </button>

                <div className="space-y-4">
                  {meusEnderecos.map((end) => (
                    <div key={end.id} className="bg-white p-6 rounded-[30px] border border-zinc-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="font-black text-zinc-700 text-sm leading-none">{end.titulo}</p>
                          <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">{end.rua ? `${end.rua}, ${end.numero}` : "Endereço não definido"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setModalEndereco({ aberto: true, id: end.id, titulo: end.titulo })} className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors">
                          <Plus size={18} />
                        </button>
                        {end.id !== '1' && end.id !== '2' && (
                          <button onClick={() => removerEndereco(end.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          ) : (
            <>
              <div className="relative flex items-center gap-6 py-10 border-b border-zinc-100 bg-white -mx-5 px-5">
                <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden"><User size={48} className="text-orange-600" /></div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
                  <p className="text-zinc-400 font-bold text-sm mt-1 leading-none">@{usuarioUsername}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-zinc-500 text-xs font-bold">{usuarioEmail}</p>
                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{usuarioTelefone}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90">
                  <LogOut size={22} />
                </button>
              </div>
              <div className="mt-8 space-y-4">
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] px-2">Configurações</h3>
                
                {/* Meus Endereços */}
                <button onClick={() => setGerenciandoEnderecos(true)} className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                      <MapPin size={22} className="text-orange-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-zinc-800 text-sm leading-none">Meus Endereços</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Gerenciar locais salvos</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300" />
                </button>

                {/* Histórico de Pedidos */}
                <button onClick={() => setAbaAtiva('Pedidos')} className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                      <ClipboardList size={22} className="text-orange-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-zinc-800 text-sm leading-none">Ver meus pedidos</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Histórico de pedidos anteriores</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300" />
                </button>

              </div>
            </>
          )}
        </div>
      )}
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); setEstaFinalizando(false); setGerenciandoEnderecos(false); }} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><Home size={24} /><span className="text-[10px] font-black uppercase leading-none">Inicio</span></button>
        <button onClick={() => { setAbaAtiva('Pedidos'); setGerenciandoEnderecos(false); }} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><ClipboardList size={24} /><span className="text-[10px] font-black uppercase leading-none">Pedidos</span></button>
        <button onClick={() => { setAbaAtiva('Perfil'); setGerenciandoEnderecos(false); }} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Perfil' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><User size={24} /><span className="text-[10px] font-black uppercase leading-none">Perfil</span></button>
      </nav>
      
      {abaAtiva === 'Inicio' && carrinho.length > 0 && !estaFinalizando && (
        <div className="fixed bottom-32 left-6 right-6 z-40 mx-auto max-w-md animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={() => setEstaFinalizando(true)} 
            className="w-full bg-zinc-900 text-white p-5 rounded-[25px] font-black shadow-2xl flex justify-between items-center ring-4 ring-white active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-zinc-400 uppercase leading-none">Ver sacola</p>
                  <p className="text-sm uppercase leading-none mt-1">
                    {carrinho.length} {carrinho.length === 1 ? 'Item' : 'Itens'}
                  </p>
                </div>
            </div>
            <span className="text-xl font-black italic text-orange-400">
              R$ {totalCarrinho.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}