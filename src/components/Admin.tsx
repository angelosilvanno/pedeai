import React, { useState } from 'react'
import { 
  Lock, 
  Store, 
  DollarSign, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronRight, 
  BarChart3, 
  Users 
} from 'lucide-react'
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
  const [abaAdmin, setAbaAdmin] = useState<'Dash' | 'Lojas'>('Dash');
  const faturamentoTotal = todosOsPedidos.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-top duration-700 pb-32">
      
      {/* CARD DE IDENTIFICAÇÃO DO ADMINISTRADOR COM LOGOUT */}
      <div className="flex items-center gap-6 py-6 border-b border-zinc-100 bg-white -mx-5 px-5 mb-4">
        <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm overflow-hidden text-zinc-400">
          <User size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-zinc-800 tracking-tight leading-none">{usuarioNomeCompleto}</h2>
          <p className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-widest flex items-center gap-1 leading-none">
            <ShieldCheck size={10} className="text-orange-500" /> Administrador do Sistema
          </p>
          <p className="text-zinc-300 text-[10px] font-bold mt-1 lowercase leading-none">{usuarioEmail}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
          title="Sair da Conta"
        >
          <LogOut size={22} />
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO BASEADO NA ABA DO FOOTER */}
      {abaAdmin === 'Dash' ? (
        <div className="space-y-6">
          <h3 className="px-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none">Visão Geral do Negócio</h3>
          
          {/* GRID DE MÉTRICAS COMPACTO E PROFISSIONAL */}
          <div className="grid grid-cols-2 gap-4 px-1">
            
            {/* CARD FATURAMENTO REDUZIDO */}
            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-green-600 border border-zinc-100">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Faturamento</p>
                <p className="text-xl font-black text-zinc-800 tracking-tighter mt-2 leading-none">
                  R$ {faturamentoTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* CARD PARCEIROS REDUZIDO */}
            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-zinc-100 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-orange-600 border border-zinc-100">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Parceiros</p>
                <p className="text-xl font-black text-zinc-800 tracking-tighter mt-2 leading-none">
                  {todasAsLojas.length}
                </p>
              </div>
            </div>

          </div>

          {/* ÁREA DE STATUS DO SISTEMA (OPCIONAL/ESTÉTICO) */}
          <div className="px-1">
            <div className="bg-zinc-900 p-6 rounded-[35px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Servidor Online</span>
              </div>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">v1.0.4</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5 px-1">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase ml-4 tracking-[0.2em] leading-none">Gestão de Lojas</h3>
          
          {todasAsLojas.map(loja => (
            <div key={loja.id} className="bg-white p-5 rounded-[35px] border border-zinc-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-zinc-50 rounded-[22px] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform leading-none">
                  {getStoreIcon(loja.imagem)}
                </div>
                <div>
                  <h4 className="font-black text-zinc-800 tracking-tight text-base leading-none mb-2">{loja.nome}</h4>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest leading-none ${loja.status === 'Ativa' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {loja.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {loja.status === 'Ativa' ? (
                  <button 
                    onClick={() => { 
                      setTodasAsLojas(todasAsLojas.map(l => l.id === loja.id ? {...l, status: 'Bloqueada'} : l)); 
                      notify("Loja bloqueada."); 
                    }}
                    className="h-12 w-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 leading-none"
                    title="Bloquear Loja"
                  >
                    <Lock size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => { 
                      setTodasAsLojas(todasAsLojas.map(l => l.id === loja.id ? {...l, status: 'Ativa'} : l)); 
                      notify("Loja ativada!"); 
                    }}
                    className="h-12 px-6 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all active:scale-90 leading-none"
                  >
                    Ativar
                  </button>
                )}
                <ChevronRight size={18} className="text-zinc-200 ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER FIXO DO ADMIN (NAVEGAÇÃO POR MÉTRICAS E PARCEIROS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-xl bg-white/95 backdrop-blur-xl border-t border-zinc-100 p-6 flex justify-around rounded-t-[45px] shadow-2xl">
        <button 
          onClick={() => setAbaAdmin('Dash')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAdmin === 'Dash' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Métricas</span>
        </button>
        <button 
          onClick={() => setAbaAdmin('Lojas')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${abaAdmin === 'Lojas' ? 'text-orange-600 scale-110' : 'text-zinc-300'}`}
        >
          <Store size={24} />
          <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Parceiros</span>
        </button>
      </nav>
      
    </div>
  );
}