import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  MapPin, 
  Clock, 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Utensils,
  X
} from 'lucide-react'
import type { Pedido, Produto } from '../types'

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
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '' });

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

    setTodosOsProdutos([{
      id: Math.random().toString(), 
      lojaId: 1, 
      nome: novoProduto.nome, 
      preco: precoNum, 
      descricao: "Item do cardápio"
    }, ...todosOsProdutos]);

    setNovoProduto({ nome: '', preco: '' });
    setMostrarModalProduto(false);
    notify("Produto adicionado!", "sucesso");
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-32">
      
      {/* Cabeçalho */}
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
          <h3 className="px-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Pedidos Recebidos</h3>
          {todosOsPedidos.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 mb-4">
                <ShoppingBag size={32} className="text-zinc-300" />
              </div>
              <p className="font-black text-zinc-300 uppercase tracking-widest leading-none">Sem pedidos no momento</p>
            </div>
          ) : (
            todosOsPedidos.map(p => (
              <div 
                key={p.id} 
                className={`bg-white p-8 rounded-[45px] border border-zinc-100 shadow-sm space-y-6 border-l-12 transition-all ${
                  p.status === 'Entregue' ? 'border-l-green-500 opacity-70' : 'border-l-orange-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-zinc-800 text-lg leading-none">{p.clienteNome}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-tight flex items-center gap-1 leading-none">
                      <Clock size={10} /> #{p.id.split('-')[0]}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase leading-none ${
                    p.status === 'Entregue' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="bg-zinc-50 p-5 rounded-3xl space-y-2 border border-zinc-100">
                  {p.itens.map((item: Produto, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-bold text-zinc-600">
                      <span>• {item.nome}</span>
                      <span className="text-zinc-400">x1</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 px-2 text-xs font-bold text-zinc-400 uppercase">
                  <MapPin size={14} className="text-orange-500" /> {p.endereco}
                </div>

                <div className="flex gap-3 pt-2">
                  {p.status === 'Pendente' && (
                    <button 
                      onClick={() => mudarStatusPedidoVendedor(p.id, 'Preparando')}
                      className="flex-1 bg-green-600 text-white p-5 rounded-[22px] font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
                    >
                      Aceitar Pedido
                    </button>
                  )}

                  {p.status === 'Preparando' && (
                    <button 
                      onClick={() => mudarStatusPedidoVendedor(p.id, 'Entregue')}
                      className="flex-1 bg-zinc-900 text-white p-5 rounded-[22px] font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> Finalizar Entrega
                    </button>
                  )}

                  {p.status === 'Entregue' && (
                    <div className="flex-1 bg-green-50 text-green-700 p-5 rounded-[22px] font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-green-100">
                      <CheckCircle size={14} /> Pedido Entregue
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <button 
            onClick={() => setMostrarModalProduto(true)}
            className="w-full bg-orange-600 text-white py-5 rounded-[25px] font-black uppercase text-sm shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Plus size={20} /> Adicionar Produto
          </button>

          <div className="space-y-4">
            <h3 className="px-4 text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">Produtos Atuais</h3>
            {todosOsProdutos.map((p: Produto) => (
              <div key={p.id} className="bg-white p-6 rounded-[35px] border border-zinc-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-800 text-sm leading-none">{p.nome}</h4>
                    <p className="font-black text-green-600 text-xs italic mt-1">R$ {p.preco.toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { 
                    setTodosOsProdutos(todosOsProdutos.filter(p2 => p2.id !== p.id)); 
                    notify("Removido.", "sucesso"); 
                  }}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Profissional para Novo Produto */}
      {mostrarModalProduto && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">Novo Item</h3>
              <button onClick={() => setMostrarModalProduto(false)} className="p-2 text-zinc-400 hover:text-zinc-800"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2">Nome do Produto</label>
                <input 
                  type="text"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                  className="w-full bg-zinc-50 border-none rounded-2xl p-4 font-bold text-zinc-700 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Ex: Pizza de Calabresa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2">Preço (R$)</label>
                <input 
                  type="text"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})}
                  className="w-full bg-zinc-50 border-none rounded-2xl p-4 font-bold text-zinc-700 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="0,00"
                />
              </div>
            </div>

            <button 
              onClick={salvarNovoProduto}
              className="w-full bg-zinc-900 text-white py-5 rounded-[22px] font-black uppercase text-sm shadow-xl active:scale-95 transition-all"
            >
              Confirmar e Salvar
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button onClick={() => setAbaVendedor('Pedidos')} className={`flex flex-col items-center gap-1.5 ${abaVendedor === 'Pedidos' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}>
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Vendas</span>
        </button>
        <button onClick={() => setAbaVendedor('Cardapio')} className={`flex flex-col items-center gap-1.5 ${abaVendedor === 'Cardapio' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}>
          <Utensils size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Cardápio</span>
        </button>
      </nav>
    </div>
  );
}