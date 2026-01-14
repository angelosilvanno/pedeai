import React from 'react'
import { Lock, Store, DollarSign, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react'
import type { Loja, Pedido } from '../types'

interface AdminProps {
  todasAsLojas: Loja[];
  setTodasAsLojas: React.Dispatch<React.SetStateAction<Loja[]>>;
  todosOsPedidos: Pedido[];
  getStoreIcon: (name: string) => React.ReactNode;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
}

export default function Admin({ todasAsLojas, setTodasAsLojas, todosOsPedidos, getStoreIcon, notify }: AdminProps) {
  const faturamentoTotal = todosOsPedidos.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-10 animate-in slide-in-from-top duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-zinc-800 uppercase italic tracking-tighter leading-none">PedeAí Admin Platform</h2>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-green-500" /> Acesso de Super Administrador
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Faturamento</p>
            <p className="text-2xl font-black text-green-600 tracking-tighter">R$ {faturamentoTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center">
            <Store size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Parceiros</p>
            <p className="text-2xl font-black text-orange-600 tracking-tighter">{todasAsLojas.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Gestão de Lojas</h3>
          <TrendingUp size={16} className="text-zinc-300" />
        </div>

        {todasAsLojas.map(loja => (
          <div key={loja.id} className="bg-white p-5 rounded-[35px] border border-zinc-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-zinc-50 rounded-[22px] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                {getStoreIcon(loja.imagem)}
              </div>
              <div>
                <h4 className="font-black text-zinc-800 tracking-tight text-base leading-none mb-2">{loja.nome}</h4>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${loja.status === 'Ativa' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {loja.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {loja.status === 'Ativa' ? (
                <button 
                  onClick={() => { setTodasAsLojas(todasAsLojas.map(l => l.id === loja.id ? {...l, status: 'Bloqueada'} : l)); notify("Loja bloqueada."); }}
                  className="h-12 w-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="Bloquear Loja"
                >
                  <Lock size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => { setTodasAsLojas(todasAsLojas.map(l => l.id === loja.id ? {...l, status: 'Ativa'} : l)); notify("Loja ativada!"); }}
                  className="h-12 px-6 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all active:scale-90"
                >
                  Ativar
                </button>
              )}
              <ChevronRight size={18} className="text-zinc-200 ml-2" />
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-[9px] text-zinc-300 font-bold uppercase tracking-[0.3em] pt-10">PedeAí Admin Security v2.1</p>
    </div>
  );
}