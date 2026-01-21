import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  MapPin, 
  ShoppingBag, 
  CheckCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Utensils,
  X,
  Droplets,
  Timer,
  PackageCheck
} from 'lucide-react'
import type { Pedido, Produto } from '../types'

interface ProdutoComCategoria extends Produto {
  categoria?: string;
}

interface VendedorProps {
  todosOsPedidos: Pedido[];
  todosOsProdutos: Produto[];
  setTodosOsProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
  handleLogout: () => void;
  usuarioNomeCompleto: string;
  usuarioEmail: string;
  mudarStatusPedidoVendedor: (pedidoId: string, novoStatus: Pedido['status']) => Promise<void>;
}

export default function Vendedor({ 
  todosOsPedidos,
  todosOsProdutos, 
  setTodosOsProdutos, 
  notify, 
  handleLogout, 
  usuarioNomeCompleto, 
  usuarioEmail,
  mudarStatusPedidoVendedor  
}: VendedorProps) {
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');
  const [mostrarModalProduto, setMostrarModalProduto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', categoria: 'Pizza' });

  const confirmarSaida = () => {
    handleLogout();
    notify("Sessão encerrada", "sucesso");
  };

  const salvarNovoProduto = () => {
    if (!novoProduto.nome || !novoProduto.preco) {
      notify("Preencha todos os campos", "erro");
      return;
    }

    const precoNum = parseFloat(novoProduto.preco.replace(',', '.'));
    if (isNaN(precoNum)) {
      notify("Preço inválido", "erro");
      return;
    }

    const itemFormatado: ProdutoComCategoria = {
      id: crypto.randomUUID(), 
      lojaId: 1, 
      nome: novoProduto.nome, 
      preco: precoNum, 
      descricao: novoProduto.categoria === 'Bebida' ? "Refrigerante gelado" : "Pizza artesanal",
      categoria: novoProduto.categoria
    };

    setTodosOsProdutos([itemFormatado as Produto, ...todosOsProdutos]);
    setNovoProduto({ nome: '', preco: '', categoria: 'Pizza' });
    setMostrarModalProduto(false);
    notify("Produto adicionado!", "sucesso");
  };

  const pedidosFiltrados = (todosOsPedidos || []).filter(p => {
    const nomeLojaPedido = String(p.lojaNome || (p as { loja_nome?: string }).loja_nome || '').toLowerCase();
    const nomeVendedor = String(usuarioNomeCompleto || '').toLowerCase();
    return nomeLojaPedido.includes("pizzaria") || nomeLojaPedido.includes("oliveira") || nomeLojaPedido === nomeVendedor;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-32">
      
      {/* Header Refinado - Fix: bg-linear-to-br */}
      <div className="flex items-center gap-4 py-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 -mx-5 px-5 mb-2">
        <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden text-white">
          <User size={28} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
          <p className="text-orange-600 font-black text-[9px] mt-1.5 uppercase tracking-[0.15em] leading-none bg-orange-50 inline-block px-2 py-1 rounded-md">Gestão Operacional</p>
          <p className="hidden sm:block text-zinc-400 text-[10px] font-medium mt-1 lowercase leading-none">{usuarioEmail}</p>
        </div>
        <button 
          onClick={confirmarSaida} 
          className="p-3.5 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-zinc-100"
        >
          <LogOut size={20} />
        </button>
      </div>

      {abaVendedor === 'Pedidos' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Fluxo de Pedidos</h3>
            <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Ao vivo</span>
          </div>
          
          {(!pedidosFiltrados || pedidosFiltrados.length === 0) ? (
            <div className="py-24 text-center bg-zinc-50/50 rounded-[40px] border-2 border-dashed border-zinc-100">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                <ShoppingBag size={32} className="text-zinc-200" />
              </div>
              <p className="font-black text-zinc-300 uppercase tracking-widest text-xs leading-none">Aguardando pedidos...</p>
            </div>
          ) : (
            pedidosFiltrados.map(p => {
              const itensArray: ProdutoComCategoria[] = Array.isArray(p.itens) 
                ? (p.itens as ProdutoComCategoria[])
                : typeof p.itens === 'string' 
                  ? JSON.parse(p.itens) 
                  : [];

              return (
                /* Fix: border-l-12 */
                <div 
                  key={p.id} 
                  className={`bg-white p-6 sm:p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6 border-l-12 transition-all relative overflow-hidden ${
                    p.status === 'Entregue' ? 'border-l-green-500 opacity-80 scale-[0.98]' : 'border-l-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-zinc-800 text-xl tracking-tight leading-none">
                        {p.clienteNome || (p as { cliente_nome?: string }).cliente_nome || 'Cliente'}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex items-center gap-1 leading-none bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                          <Timer size={10} className="text-orange-500" /> #{String(p.id).split('-')[0]}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase shadow-sm tracking-wider leading-none ${
                      p.status === 'Entregue' 
                        ? 'bg-green-500 text-white' 
                        : p.status === 'Preparando'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="bg-zinc-50/80 p-5 rounded-[28px] space-y-3 border border-zinc-100">
                    {itensArray.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-bold text-zinc-700 leading-none">
                        <span className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-orange-400" />
                          {item.categoria === 'Bebida' ? <Droplets size={14} className="text-blue-500" /> : null} 
                          {item.nome}
                        </span>
                        <span className="bg-white px-2 py-1 rounded-lg border border-zinc-200 text-xs text-zinc-400">x1</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 px-2 text-xs font-bold text-zinc-500 tracking-tight leading-tight">
                    <MapPin size={16} className="text-orange-500 shrink-0" /> 
                    <span className="uppercase">{p.endereco}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    {p.status === 'Pendente' && (
                      <button 
                        onClick={async () => {
                          try {
                            await mudarStatusPedidoVendedor(p.id, 'Preparando');
                            notify("Iniciando preparo da pizza!", "sucesso");
                          } catch {
                            notify("Erro ao aceitar pedido", "erro");
                          }
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-black text-[11px] uppercase shadow-lg shadow-green-200 active:scale-95 transition-all leading-none flex items-center justify-center gap-2"
                      >
                        <Utensils size={16} /> Aceitar Pedido
                      </button>
                    )}

                    {p.status === 'Preparando' && (
                      <button 
                        onClick={async () => {
                          try {
                            await mudarStatusPedidoVendedor(p.id, 'Entregue');
                            notify("Saiu para entrega!", "sucesso");
                          } catch {
                            notify("Erro ao finalizar entrega", "erro");
                          }
                        }}
                        className="flex-1 bg-zinc-900 hover:bg-black text-white p-5 rounded-2xl font-black text-[11px] uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 leading-none"
                      >
                        <PackageCheck size={18} /> Finalizar Entrega
                      </button>
                    )}

                    {p.status === 'Entregue' && (
                      <div className="flex-1 bg-zinc-100 text-zinc-400 p-5 rounded-2xl font-black text-[11px] uppercase flex items-center justify-center gap-2 border border-zinc-200 leading-none">
                        <CheckCircle size={16} /> Pedido Concluído
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <button 
            onClick={() => setMostrarModalProduto(true)}
            className="w-full bg-orange-600 text-white py-5 rounded-[22px] font-black uppercase text-xs shadow-lg shadow-orange-200 flex items-center justify-center gap-3 active:scale-95 transition-all leading-none group"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Adicionar Novo Item
          </button>

          <div className="space-y-4">
            <h3 className="px-4 text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest leading-none">Gestão de Cardápio</h3>
            
            {(!todosOsProdutos || todosOsProdutos.length === 0) ? (
               <div className="text-center py-20 bg-zinc-50 rounded-[40px] border border-zinc-100 border-dashed">
                 <Utensils size={40} className="mx-auto text-zinc-200 mb-4" />
                 <p className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest">Nenhum item cadastrado</p>
               </div>
            ) : (
              todosOsProdutos.map((p) => {
                const pc = p as ProdutoComCategoria;
                return (
                  <div key={pc.id} className="bg-white p-5 rounded-[30px] border border-zinc-100 flex justify-between items-center shadow-sm group hover:border-orange-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center leading-none transition-colors ${pc.categoria === 'Bebida' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-600'}`}>
                        {pc.categoria === 'Bebida' ? <Droplets size={24} /> : <Utensils size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-zinc-800 text-sm leading-none">{pc.nome}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="font-black text-green-600 text-xs tracking-tight leading-none bg-green-50 px-2 py-1 rounded-md">
                            R$ {Number(pc.preco || 0).toFixed(2)}
                          </p>
                          <span className="text-[9px] font-bold text-zinc-300 uppercase">{pc.categoria}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        setTodosOsProdutos(prev => prev.filter(p2 => p2.id !== pc.id)); 
                        notify("Item removido.", "sucesso"); 
                      }}
                      className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-50 text-zinc-300 hover:bg-red-500 hover:text-white transition-all active:scale-90 leading-none shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal Refinado */}
      {mostrarModalProduto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[45px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-zinc-100 mb-20 sm:mb-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter leading-none">Novo Item</h3>
                <p className="text-zinc-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Adicionar ao cardápio</p>
              </div>
              <button onClick={() => setMostrarModalProduto(false)} className="p-3 bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors leading-none"><X size={20} /></button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-3 leading-none tracking-widest">Categoria</label>
                <div className="flex gap-2 bg-zinc-100 p-1.5 rounded-[20px]">
                  <button 
                    onClick={() => setNovoProduto({...novoProduto, categoria: 'Pizza'})}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${novoProduto.categoria === 'Pizza' ? 'bg-white text-orange-600 shadow-sm' : 'text-zinc-400'}`}
                  >
                    <Utensils size={14} /> Pizza
                  </button>
                  <button 
                    onClick={() => setNovoProduto({...novoProduto, categoria: 'Bebida'})}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${novoProduto.categoria === 'Bebida' ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400'}`}
                  >
                    <Droplets size={14} /> Bebida
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-3 leading-none tracking-widest">Nome do Item</label>
                <input 
                  type="text"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-orange-100 rounded-2xl p-5 font-bold text-zinc-700 focus:ring-4 focus:ring-orange-50/50 outline-none transition-all placeholder:text-zinc-300"
                  placeholder={novoProduto.categoria === 'Pizza' ? "Ex: Pizza de Calabresa" : "Ex: Coca-Cola 2L"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-3 leading-none tracking-widest">Preço de Venda (R$)</label>
                <input 
                  type="text"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})}
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-green-100 rounded-2xl p-5 font-bold text-zinc-700 focus:ring-4 focus:ring-green-50/50 outline-none transition-all placeholder:text-zinc-300"
                  placeholder="0,00"
                />
              </div>
            </div>

            <button 
              onClick={salvarNovoProduto}
              className={`w-full py-5 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all leading-none text-white mt-4 flex items-center justify-center gap-2 ${novoProduto.categoria === 'Bebida' ? 'bg-blue-600 shadow-blue-200' : 'bg-zinc-900 shadow-zinc-200'}`}
            >
              <CheckCircle size={18} /> Salvar Produto
            </button>
          </div>
        </div>
      )}

      {/* Nav de Baixo Estilizada - Fix: tracking-widest */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/90 backdrop-blur-2xl border-t border-zinc-100 px-10 py-6 flex justify-around rounded-t-[50px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button onClick={() => setAbaVendedor('Pedidos')} className={`flex flex-col items-center gap-2 transition-all relative ${abaVendedor === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300 hover:text-zinc-400'}`}>
          <LayoutDashboard size={24} strokeWidth={abaVendedor === 'Pedidos' ? 2.5 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Vendas</span>
          {abaVendedor === 'Pedidos' && <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-orange-600" />}
        </button>
        <button onClick={() => setAbaVendedor('Cardapio')} className={`flex flex-col items-center gap-2 transition-all relative ${abaVendedor === 'Cardapio' ? 'text-orange-600 scale-110' : 'text-zinc-300 hover:text-zinc-400'}`}>
          <Utensils size={24} strokeWidth={abaVendedor === 'Cardapio' ? 2.5 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cardápio</span>
          {abaVendedor === 'Cardapio' && <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-orange-600" />}
        </button>
      </nav>
    </div>
  );
}