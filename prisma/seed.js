import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco de dados...');
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.loja.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('👤 Usuários...');
  const angelo = await prisma.usuario.create({
    data: {
      nome: "Angelo Silvano",
      username: "angelosilvanno",
      email: "angeloestudante1@gmail.com",
      telefone: "8499566634",
      senha: "angelo26",
      tipo: "Cliente"
    }
  });

  await prisma.usuario.create({
    data: {
      nome: "Ricardo Oliveira",
      username: "ricardo_pizzaria",
      email: "pizazariaoliveira26@gmail.com",
      telefone: "8499887766",
      senha: "ricardo_pizzaria",
      tipo: "Vendedor"
    }
  });

  await prisma.usuario.create({
    data: {
      nome: "Beatriz Cavalcante",
      username: "admin_beatriz",
      email: "beatrizcavalcante14@gmail.com",
      telefone: "",
      senha: "admin123",
      tipo: "Admin"
    }
  });

  console.log('🏪 Estabelecimentos e Produtos...');
  // Loja 1
  await prisma.loja.create({
    data: {
      id: 1,
      nome: "Pizzaria Oliveira",
      categoria: "Pizzas",
      imagem: "Pizza",
      status: "Ativa",
      abertura: "18:00",
      fechamento: "23:59",
      produtos: {
        create: [
          { id: "p1", nome: "Pizza Margherita", preco: 48.9, descricao: "Molho de tomate, muçarela, fatias de tomate e manjericão fresco." },
          { id: "p2", nome: "Pizza Calabresa", preco: 45.0, descricao: "Calabresa fatiada, cebola e azeitonas pretas." },
          { id: "p3", nome: "Pizza Frango com Catupiry", preco: 52.0, descricao: "Frango desfiado temperado com cobertura de Catupiry original." }
        ]
      }
    }
  });

  // Loja 2
  await prisma.loja.create({
    data: {
      id: 2,
      nome: "Burger da Mari",
      categoria: "Lanches",
      imagem: "UtensilsCrossed",
      status: "Ativa",
      abertura: "17:30",
      fechamento: "23:30",
      produtos: {
        create: [
          { id: "h1", nome: "Smash Burger Clássico", preco: 26.5, descricao: "Hambúrguer prensado, queijo cheddar e molho da casa no pão brioche." },
          { id: "h2", nome: "X-Bacon", preco: 32.9, descricao: "Hambúrguer de carne bovina, muito bacon, queijo e picles." },
          { id: "h3", nome: "Porção de Batata Rústica", preco: 18.0, descricao: "Batatas cortadas à mão com sal e alecrim." }
        ]
      }
    }
  });

  // Loja 3
  await prisma.loja.create({
    data: {
      id: 3,
      nome: "Doçuras da Ana",
      categoria: "Doceria",
      imagem: "CakeSlice",
      status: "Ativa",
      abertura: "13:00",
      fechamento: "19:00",
      produtos: {
        create: [
          { id: "d1", nome: "Bolo Ninho com Nutella", preco: 18.0, descricao: "Massa fofinha com recheio de leite Ninho e creme de Nutella." },
          { id: "d2", nome: "Torta Holandesa", preco: 15.5, descricao: "Sobremesa gelada com biscoito, creme leve e cobertura de chocolate." },
          { id: "d3", nome: "Brigadeiro de Pistache", preco: 6.5, descricao: "Unidade de brigadeiro feito com pedaços de pistache." }
        ]
      }
    }
  });

  // Loja 4
  await prisma.loja.create({
    data: {
      id: 4,
      nome: "Tanaka Sushi",
      categoria: "Japonesa",
      imagem: "Fish",
      status: "Ativa",
      abertura: "18:00",
      fechamento: "23:59",
      produtos: {
        create: [
          { id: "j1", nome: "Combinado Simples (15 peças)", preco: 65.0, descricao: "Variedade de sashimis e sushis tradicionais do dia." },
          { id: "j2", nome: "Temaki de Salmão", preco: 34.9, descricao: "Cone de alga recheado com salmão fresco e cream cheese." },
          { id: "j3", nome: "Hot Roll Salmão", preco: 28.0, descricao: "Sushi frito com recheio de salmão, finalizado com molho tarê." }
        ]
      }
    }
  });

  console.log('📦 Histórico de Pedidos...');
  await prisma.pedido.create({
    data: {
      id: "4d9d9458-ec41-4f97-a64c-58080bd716d2",
      lojaNome: "Pizzaria Oliveira",
      clienteNome: "Angelo Silvano",
      clienteUsername: "angelosilvanno",
      total: 48.9,
      endereco: "Rua Ozeas Pinto, Centro, nº 14",
      pagamento: "Dinheiro",
      status: "Entregue",
      itens: JSON.stringify([{ id: "p1", nome: "Pizza Margherita", preco: 48.9 }]),
      clienteId: angelo.id
    }
  });

  console.log('✅ Banco de dados SQLite populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });