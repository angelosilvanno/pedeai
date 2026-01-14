import React from 'react'
import { Lock, Store, DollarSign, ShieldCheck, User, LogOut, ChevronRight } from 'lucide-react'
import type { Loja, Pedido } from '../types'

interface AdminProps {
  todasAsLojas: Loja[];
  setTodasAsLojas: React.Dispatch<React.SetStateAction<Loja[]>>;
  todosOsPedidos: Pedido[];
  getStoreIcon: (name: string) => React.ReactNode;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
  handleLogout: () => void;
  usuarioNomeCompleto: string;
  usuarioEmail: string;
}

export default function Admin({ 
  todasAsLojas, 
  setTodasAsLojas, 
  todosOsPedidos, 
  getStoreIcon, 
  notify, 
  handleLogout, 
  usuarioNomeCompleto, 
  usuarioEmail 
}: AdminProps) {
  const faturamentoTotal = todosOsPedidos.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-top duration-700">
      
      {/* CARD DE IDENTIFICAÇÃO DO ADMINISTRADOR COM BOTÃO DE SAIR */}
      <div className="flex items-center gap-6 py-6 border-b border-zinc-100 bg-white -mx-5 px-5 mb-4">
        <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-orange-600">
          <User size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
          <p className="text-green-600 font-bold text-[10px] mt-1 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={10} /> Administrador do Sistema
          </p>
          <p className="text-zinc-300 text-[10px] font-bold mt-1 lowercase">{usuarioEmail}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
          title="Sair da Conta"
        >
          <LogOut size={22} />
        </button>
      </div>

      {/* DASHBOARD DE MÉTRICAS */}
      <div className="grid grid-cols-2 gap-5 px-1">
        <div className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Faturamento</p>
            <p className="text-2xl font-black text-green-600 tracking-tighter mt-1">R$ {faturamentoTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[45px] shadow-sm border border-zinc-100 text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center">
            <Store size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Parceiros</p>
            <p className="text-2xl font-black text-orange-600 tracking-tighter mt-1">{todasAsLojas.length}</p>
          </div>
        </div>
      </div>

      {/* GESTÃO DE ESTABELECIMENTOS */}
      <div className="space-y-5">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase ml-4 tracking-[0.2em]">Gestão de Estabelecimentos</h3>
        
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
      
    </div>
  );
}