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
  Clock 
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
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

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
  const cardapioParaExibir = useMemo(() => todosOsProdutos.filter(p => p.lojaId === lojaSelecionada?.id), [lojaSelecionada, todosOsProdutos]);

  const realizarPedidoFinal = () => {
    if (!enderecoEntrega) return notify("Endereço obrigatório.", 'erro');
    const novoPedido: Pedido = {
      id: crypto.randomUUID(),
      lojaNome: lojaSelecionada?.nome || 'PedeAí',
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
    notify("Pedido enviado!");
  };

  return (
    <>
      {abaAtiva === 'Inicio' ? (
        estaFinalizando ? (
          <div className="space-y-6 animate-in slide-in-from-right">
            <button onClick={() => setEstaFinalizando(false)} className="flex items-center gap-2 font-bold text-orange-600"><ArrowLeft size={16} /> Voltar</button>
            <div className="space-y-6 rounded-[40px] border border-zinc-100 bg-white p-10 shadow-sm">
              <h2 className="text-xl font-black">Finalizar pedido</h2>
              <input type="text" placeholder="Endereço de Entrega" className="w-full rounded-3xl bg-zinc-50 p-5 font-medium outline-none transition-all focus:ring-2 ring-orange-200" value={enderecoEntrega} onChange={(e) => setEnderecoEntrega(e.target.value)} />
              <select className="w-full rounded-3xl bg-zinc-50 p-5 font-bold outline-none" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão de Crédito</option>
              </select>
              <div className="flex justify-between border-t-2 pt-6"><span className="font-bold text-zinc-400">Total</span><p className="text-3xl font-black text-green-600">R$ {carrinho.reduce((a, i) => a + i.preco, 0).toFixed(2)}</p></div>
              <button onClick={realizarPedidoFinal} className="w-full rounded-3xl bg-orange-600 p-6 text-xl font-black text-white shadow-lg active:scale-95 transition-all">Confirmar Agora!</button>
            </div>
          </div>
        ) : !lojaSelecionada ? (
          <div className="space-y-8">
            {/* Barra de Busca com proporções equilibradas */}
            <div className="sticky top-27 z-30 bg-zinc-50/80 backdrop-blur-lg -mx-5 px-5 py-5 border-b border-zinc-100/50">
              <div className="relative group max-w-xl mx-auto">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="O que vamos pedir hoje?" 
                  className="w-full rounded-full bg-white py-4.5 pl-14 pr-8 text-base font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 outline-none transition-all focus:ring-4 ring-orange-50 focus:border-orange-100 placeholder:text-zinc-300" 
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
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setLojaSelecionada(null)} className="flex items-center gap-2 font-bold text-orange-600"><ArrowLeft size={16} /> Voltar</button>
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
        <div className="space-y-8 animate-in fade-in">
          <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">Meus pedidos</h2>
          {todosOsPedidos.length === 0 ? <p className="text-center py-20 font-bold opacity-30 uppercase">Nenhum pedido realizado</p> :
            todosOsPedidos.map(p => (
              <div key={p.id} className="rounded-[40px] border border-zinc-100 bg-white p-8 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-zinc-800 tracking-tight leading-none">{p.lojaNome}</h3>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${p.status === 'Entregue' ? 'bg-zinc-100 text-zinc-500' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{p.status}</span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 text-xs font-medium text-zinc-500 leading-relaxed">{p.itens.map(i => i.nome).join(', ')}</div>
                <div className="mt-4 pt-4 border-t flex justify-between font-black items-center">
                   <p className="text-2xl italic tracking-tighter text-zinc-800 leading-none">R$ {p.total.toFixed(2)}</p>
                   <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{p.pagamento}</p>
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <div className="relative flex items-center gap-6 py-10 border-b border-zinc-100 bg-white -mx-5 px-5">
            <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden"><User size={48} className="text-orange-600" /></div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
              <p className="text-zinc-400 font-bold text-sm mt-1 leading-none">@{usuarioUsername}</p>
              <div className="mt-2 space-y-0.5 leading-none">
                <p className="text-zinc-300 text-[10px] font-bold tracking-widest">{usuarioEmail}</p>
                <p className="text-orange-400 text-[10px] font-black tracking-widest uppercase">{usuarioTelefone}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
              title="Sair da Conta"
            >
              <LogOut size={22} />
            </button>
          </div>
          <div className="mt-8 space-y-4 px-2">
            <h3 className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 leading-none">Minha Atividade</h3>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                  <MapPin size={22} className="text-orange-600" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-zinc-800 text-sm leading-none">Meus Endereços</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1 leading-none">Gerenciar locais de entrega</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                  <ClipboardList size={22} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-zinc-800 text-sm leading-none">Histórico de Pedidos</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1 leading-none">Ver compras anteriores</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-300" />
            </button>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button onClick={() => { setAbaAtiva('Inicio'); setLojaSelecionada(null); }} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Inicio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><Home size={24} /><span className="text-[10px] font-black uppercase tracking-tighter leading-none">Inicio</span></button>
        <button onClick={() => setAbaAtiva('Pedidos')} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><ClipboardList size={24} /><span className="text-[10px] font-black uppercase tracking-tighter leading-none">Pedidos</span></button>
        <button onClick={() => setAbaAtiva('Perfil')} className={`flex flex-col items-center gap-1.5 transition-all ${abaAtiva === 'Perfil' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}><User size={24} /><span className="text-[10px] font-black uppercase tracking-tighter leading-none">Perfil</span></button>
      </nav>
      {abaAtiva === 'Inicio' && carrinho.length > 0 && !estaFinalizando && (
        <div className="fixed bottom-32 left-6 right-6 z-40 mx-auto max-w-md animate-in slide-in-from-bottom duration-500">
          <button onClick={() => setEstaFinalizando(true)} className="w-full bg-zinc-900 text-white p-7 rounded-[35px] font-black shadow-2xl flex justify-between items-center ring-4 ring-white active:scale-95 transition-all">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center leading-none"><ShoppingBag size={24} /></div>
               <p className="text-base uppercase font-bold leading-none">{carrinho.length} itens na sacola</p>
            </div>
            <span className="text-2xl font-black italic text-orange-400 leading-none">R$ {carrinho.reduce((s, i) => s + i.preco, 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </>
  );
}