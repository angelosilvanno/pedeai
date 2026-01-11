export interface Loja { 
  id: number; 
  nome: string; 
  categoria: string; 
  imagem: string; 
  status: 'Pendente' | 'Ativa' | 'Bloqueada'; 
}

export interface Produto { 
  id: string; 
  lojaId: number; 
  nome: string; 
  preco: number; 
  descricao: string; 
}

export interface Pedido {
  id: string;
  lojaNome: string;
  clienteNome: string;
  clienteUsername: string;
  itens: Produto[];
  total: number;
  endereco: string;
  pagamento: string;
  status: 'Pendente' | 'Preparando' | 'Saiu para Entrega' | 'Entregue';
}