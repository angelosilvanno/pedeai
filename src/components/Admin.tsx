import React from 'react'
import { Lock } from 'lucide-react'
import type { Loja, Pedido } from '../types'

interface AdminProps {
  todasAsLojas: Loja[];
  setTodasAsLojas: React.Dispatch<React.SetStateAction<Loja[]>>;
  todosOsPedidos: Pedido[];
  getStoreIcon: (name: string) => React.ReactNode;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
}

export default function Admin({ todasAsLojas, setTodasAsLojas, todosOsPedidos, getStoreIcon, notify }: AdminProps) {
  return (
    <div className="space-y-10 animate-in slide-in-from-top">
      <h2 className="text-center text-2xl font-black text-zinc-800 uppercase italic tracking-tighter leading-none">PedeAí Admin Platform</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">Faturamento Global</p>
          <p className="text-3xl font-black text-green-600 italic tracking-tighter leading-none">R$ {todosOsPedidos.reduce((s, p) => s + p.total, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-10 rounded-[50px] shadow-sm text-center border border-zinc-100">
          <p className="text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">Lojas Ativas</p>
          <p className="text-3xl font-black text-orange-600 leading-none">{todasAsLojas.filter(l => l.status === 'Ativa').length}</p>
        </div>
      </div>
      <div className="space-y-5">
        <h3 className="text-[11px] font-black text-zinc-400 uppercase ml-2 tracking-widest leading-none">Gestão de Parceiros</h3>
        {todasAsLojas.map(loja => (
          <div key={loja.id} className="bg-white p-6 rounded-[40px] border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-zinc-50 rounded-2xl flex items-center justify-center shadow-inner leading-none">{getStoreIcon(loja.imagem)}</div>
              <div>
                <h4 className="font-black text-zinc-800 tracking-tight leading-none mb-1">{loja.nome}</h4>
                <p className={`text-[9px] font-black uppercase tracking-widest leading-none ${loja.status === 'Ativa' ? 'text-green-500' : 'text-red-400'}`}>{loja.status}</p>
              </div>
            </div>
            <button onClick={() => {
              setTodasAsLojas(todasAsLojas.map(l => l.id === loja.id ? {...l, status: l.status === 'Ativa' ? 'Bloqueada' : 'Ativa'} : l));
              notify("Status atualizado!");
            }} className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${loja.status === 'Ativa' ? 'bg-red-50 text-red-500' : 'bg-zinc-900 text-white'}`}>
              {loja.status === 'Ativa' ? <Lock size={12} /> : 'Ativar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}