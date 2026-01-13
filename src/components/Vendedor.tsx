import React, { useState } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import type { Pedido, Produto } from '../types'

interface VendedorProps {
  todosOsPedidos: Pedido[];
  setTodosOsPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
  todosOsProdutos: Produto[];
  setTodosOsProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
  notify: (msg: string, tipo?: 'sucesso' | 'erro') => void;
}

export default function Vendedor({ todosOsPedidos, setTodosOsPedidos, todosOsProdutos, setTodosOsProdutos, notify }: VendedorProps) {
  const [abaVendedor, setAbaVendedor] = useState<'Pedidos' | 'Cardapio'>('Pedidos');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom">
      <div className="flex bg-zinc-200 p-2 rounded-[30px] shadow-inner">
        <button onClick={() => setAbaVendedor('Pedidos')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Pedidos' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>VENDAS</button>
        <button onClick={() => setAbaVendedor('Cardapio')} className={`flex-1 py-5 rounded-[22px] font-black text-xs ${abaVendedor === 'Cardapio' ? 'bg-white text-orange-600 shadow-md' : 'text-zinc-500'}`}>MEU CARDÁPIO</button>
      </div>

      {abaVendedor === 'Pedidos' ? (
        todosOsPedidos.length === 0 ? <p className="py-20 text-center font-bold text-zinc-300 uppercase tracking-widest">Sem novos pedidos.</p> :
        todosOsPedidos.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[45px] border-l-12 border-orange-500 shadow-sm space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-xl font-black text-zinc-800">{p.clienteNome}</h3><span className="text-[10px] font-black text-zinc-400 uppercase bg-zinc-50 px-3 py-1 rounded-full">{p.status}</span></div>
            <div className="bg-zinc-50 p-5 rounded-3xl font-bold italic text-zinc-500 text-sm border border-zinc-100">{p.itens.map((i, idx) => <p key={idx}>• {i.nome}</p>)}</div>
            <p className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-tight leading-none"><MapPin size={14} /> {p.endereco}</p>
            <div className="flex gap-2">
              <button onClick={() => {
                setTodosOsPedidos(todosOsPedidos.map(p2 => p2.id === p.id ? {...p2, status: 'Preparando'} : p2));
                notify("Pedido aceito!");
              }} className="flex-1 bg-green-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase transition-all active:scale-95">Aceitar</button>
              <button onClick={() => {
                setTodosOsPedidos(todosOsPedidos.map(p2 => p2.id === p.id ? {...p2, status: 'Entregue'} : p2));
                notify("Pedido entregue!");
              }} className="flex-1 bg-zinc-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase transition-all active:scale-95">Concluir</button>
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-8">
          <button onClick={() => {
            const nome = prompt("Nome do item:");
            const preco = prompt("Preço (Ex: 29.90):");
            if (nome && preco) {
              setTodosOsProdutos([{id: Math.random().toString(), lojaId: 1, nome, preco: parseFloat(preco.replace(',', '.')), descricao: "Novo item"}, ...todosOsProdutos]);
              notify("Item adicionado!");
            }
          }} className="w-full bg-orange-600 text-white py-8 rounded-[35px] font-black uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Plus size={24} /> Adicionar Produto</button>
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-zinc-400 uppercase ml-2 tracking-widest leading-none">Produtos Atuais</h3>
            {todosOsProdutos.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[35px] border border-zinc-100 flex justify-between items-center shadow-sm">
                <div><h4 className="font-black text-zinc-800">{p.nome}</h4><p className="font-black text-green-600 text-sm italic mt-1 leading-none">R$ {p.preco.toFixed(2)}</p></div>
                <button onClick={() => {
                  setTodosOsProdutos(todosOsProdutos.filter(p2 => p2.id !== p.id));
                  notify("Item removido.");
                }} className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}