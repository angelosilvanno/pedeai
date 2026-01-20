import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  CheckCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Utensils,
  X,
  Droplets
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
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-32">
      
      <div className="flex items-center gap-6 py-6 border-b border-zinc-100 bg-white -mx-5 px-5 mb-4">
        <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-orange-600">
          <User size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
          <p className="text-zinc-400 font-bold text-xs mt-1 uppercase tracking-widest leading-none">Painel do Lojista</p>
          <p className="text-zinc-300 text-[10px] font-bold mt-1 lowercase leading-none">{usuarioEmail}</p>
        </div>
        <button 
          onClick={confirmarSaida} 
          className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
        >
          <LogOut size={22} />
        </button>
      </div>

      {abaVendedor === 'Pedidos' ? (
        <div className="space-y-6">
          <h3 className="px-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Pedidos da Pizzaria</h3>
          
          {(!pedidosFiltrados || pedidosFiltrados.length === 0) ? (
            <div className="py-24 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 mb-4">
                <ShoppingBag size={32} className="text-zinc-300" />
              </div>
              <p className="font-black text-zinc-300 uppercase tracking-widest leading-none">Sem pedidos de pizza agora</p>
            </div>
          ) : (
            pedidosFiltrados.map(p => {
              const itensArray: ProdutoComCategoria[] = Array.isArray(p.itens) 
                ? (p.itens as ProdutoComCategoria[])
                : typeof p.itens === 'string' 
                  ? JSON.parse(p.itens) 
                  : [];

              return (
                <div 
                  key={p.id} 
                  className={`bg-white p-8 rounded-[45px] border border-zinc-100 shadow-sm space-y-6 border-l-12 transition-all ${
                    p.status === 'Entregue' ? 'border-l-green-500 opacity-70' : 'border-l-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-zinc-800 text-lg leading-none">
                        {p.clienteNome || (p as { cliente_nome?: string }).cliente_nome || 'Cliente'}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-tight flex items-center gap-1 leading-none">
                        <Clock size={10} /> #{String(p.id).split('-')[0]}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase leading-none ${
                      p.status === 'Entregue' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-3xl space-y-2 border border-zinc-100">
                    {itensArray.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-bold text-zinc-600 leading-none">
                        <span className="flex items-center gap-2">
                          {item.categoria === 'Bebida' ? <Droplets size={12} className="text-blue-500" /> : '•'} 
                          {item.nome}
                        </span>
                        <span className="text-zinc-400">x1</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 px-2 text-xs font-bold text-zinc-400 uppercase tracking-tight leading-none">
                    <MapPin size={14} className="text-orange-500" /> {p.endereco}
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
                        className="flex-1 bg-green-600 text-white p-5 rounded-[22px] font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all leading-none"
                      >
                        Aceitar Pedido
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
                        className="flex-1 bg-zinc-900 text-white p-5 rounded-[22px] font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 leading-none"
                      >
                        <CheckCircle size={14} /> Finalizar Entrega
                      </button>
                    )}

                    {p.status === 'Entregue' && (
                      <div className="flex-1 bg-green-50 text-green-700 p-5 rounded-[22px] font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-green-100 leading-none">
                        <CheckCircle size={14} /> Pedido Entregue
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
            className="w-full bg-orange-600 text-white py-4.5 rounded-2xl font-black uppercase text-xs shadow-lg shadow-orange-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all leading-none"
          >
            <Plus size={20} /> Adicionar Item
          </button>

          <div className="space-y-4">
            <h3 className="px-4 text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest leading-none">Cardápio da Pizzaria</h3>
            
            {(!todosOsProdutos || todosOsProdutos.length === 0) ? (
               <p className="text-center py-10 text-zinc-300 font-bold uppercase">Nenhum item cadastrado</p>
            ) : (
              todosOsProdutos.map((p) => {
                const pc = p as ProdutoComCategoria;
                return (
                  <div key={pc.id} className="bg-white p-6 rounded-[35px] border border-zinc-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 leading-none">
                        {pc.categoria === 'Bebida' ? <Droplets size={20} /> : <Utensils size={20} />}
                      </div>
                      <div>
                        <h4 className="font-black text-zinc-800 text-sm leading-none">{pc.nome}</h4>
                        <p className="font-black text-green-600 text-xs italic mt-1 leading-none">
                          R$ {Number(pc.preco || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        setTodosOsProdutos(prev => prev.filter(p2 => p2.id !== pc.id)); 
                        notify("Item removido.", "sucesso"); 
                      }}
                      className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 leading-none"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {mostrarModalProduto && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-zinc-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter leading-none">Novo Item</h3>
              <button onClick={() => setMostrarModalProduto(false)} className="p-2 text-zinc-400 hover:text-zinc-800 leading-none"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 leading-none">Categoria</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setNovoProduto({...novoProduto, categoria: 'Pizza'})}
                    className={`flex-1 p-3 rounded-xl font-bold text-[10px] uppercase transition-all ${novoProduto.categoria === 'Pizza' ? 'bg-orange-600 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                  >
                    Pizza
                  </button>
                  <button 
                    onClick={() => setNovoProduto({...novoProduto, categoria: 'Bebida'})}
                    className={`flex-1 p-3 rounded-xl font-bold text-[10px] uppercase transition-all ${novoProduto.categoria === 'Bebida' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                  >
                    Bebida
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 leading-none">Nome do Item</label>
                <input 
                  type="text"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                  className="w-full bg-zinc-50 border-none rounded-2xl p-4 font-bold text-zinc-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder={novoProduto.categoria === 'Pizza' ? "Ex: Pizza de Calabresa" : "Ex: Coca-Cola 2L (Zero)"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 leading-none">Preço (R$)</label>
                <input 
                  type="text"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})}
                  className="w-full bg-zinc-50 border-none rounded-2xl p-4 font-bold text-zinc-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="0,00"
                />
              </div>
            </div>

            <button 
              onClick={salvarNovoProduto}
              className={`w-full py-5 rounded-[22px] font-black uppercase text-sm shadow-xl active:scale-95 transition-all leading-none text-white ${novoProduto.categoria === 'Bebida' ? 'bg-blue-600' : 'bg-zinc-900'}`}
            >
              Confirmar e Salvar
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button onClick={() => setAbaVendedor('Pedidos')} className={`flex flex-col items-center gap-1.5 transition-all ${abaVendedor === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}>
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Vendas</span>
        </button>
        <button onClick={() => setAbaVendedor('Cardapio')} className={`flex flex-col items-center gap-1.5 transition-all ${abaVendedor === 'Cardapio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}>
          <Utensils size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Cardápio</span>
        </button>
      </nav>
    </div>
  );
}