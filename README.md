# PedeAí - Delivery Profissional

O PedeAí é um sistema de delivery completo feito para facilitar o comércio em cidades pequenas. Ele aproxima os comerciantes dos clientes com uma interface simples e rápida, contando com avisos automáticos pelo WhatsApp para ninguém perder o status do pedido.

## 🔥 Introdução

Este projeto visa solucionar a carência de plataformas de delivery em regiões menores, oferecendo uma interface intuitiva para três perfis de usuários:
- **Clientes:** Podem navegar por lojas, gerenciar endereços, montar sacolas e acompanhar pedidos em tempo real.
- **Vendedores:** Gerenciam seu cardápio, recebem pedidos, alteram status de produção e visualizam métricas de vendas.
- **Administradores:** Controlam a entrada de novos parceiros, gerenciam cupons de desconto, bloqueiam/desbloqueiam estabelecimentos e acompanham o faturamento global da plataforma.

### ⚙️ Pré-requisitos

Para rodar este projeto, você precisará ter instalado:
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes NPM, Yarn ou PNPM
- Uma conta no Supabase para o banco de dados PostgreSQL
- Um dispositivo com WhatsApp para a automação de mensagens

### 🔨 Guia de instalação

Siga o passo a passo abaixo para configurar o ambiente de desenvolvimento:

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pedeai.git
```

2. Entre na pasta do projeto:
```bash
cd pedeai
```

3. Instale as dependências:
```bash
npm install
```

4. Configure as variáveis de ambiente no arquivo `.env` (baseie-se no `.env.example`):
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

5. Execute o projeto:
```bash
npm run dev
```

## 📦 Tecnologias usadas:

**Front-end:**
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- Lucide-React (Ícones)

**Back-end:**
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
- whatsapp-web.js (Automação)
