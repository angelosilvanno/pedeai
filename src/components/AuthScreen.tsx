import { useState } from 'react';

interface AuthProps {
  telaAuth: 'Login' | 'Cadastro';
  setTelaAuth: (tela: 'Login' | 'Cadastro') => void;
  campoLoginIdentificacao: string;
  setCampoLoginIdentificacao: (val: string) => void;
  campoLoginSenha: string;
  setCampoLoginSenha: (val: string) => void;
  usuarioNomeCompleto: string;
  setUsuarioNomeCompleto: (val: string) => void;
  usuarioUsername: string;
  setUsuarioUsername: (val: string) => void;
  usuarioEmail: string;
  setUsuarioEmail: (val: string) => void;
  usuarioSenha: string;
  setUsuarioSenha: (val: string) => void;
  usuarioSenhaConfirm: string;
  setUsuarioSenhaConfirm: (val: string) => void;
  tipoUsuario: 'Cliente' | 'Vendedor' | 'Admin';
  setTipoUsuario: (tipo: 'Cliente' | 'Vendedor' | 'Admin') => void;
  nomeLoja: string;
  setNomeLoja: (val: string) => void;
  handleLogin: () => void;
  handleCadastro: () => void;
}

export function AuthScreen({
  telaAuth,
  setTelaAuth,
  campoLoginIdentificacao,
  setCampoLoginIdentificacao,
  campoLoginSenha,
  setCampoLoginSenha,
  usuarioNomeCompleto,
  setUsuarioNomeCompleto,
  usuarioUsername,
  setUsuarioUsername,
  usuarioEmail,
  setUsuarioEmail,
  usuarioSenha,
  setUsuarioSenha,
  usuarioSenhaConfirm,
  setUsuarioSenhaConfirm,
  tipoUsuario,
  setTipoUsuario,
  nomeLoja,
  setNomeLoja,
  handleLogin,
  handleCadastro
}: AuthProps) {
  
  const [erro, setErro] = useState<string | null>(null);

  // CORREÇÃO: Nome da variável sem hífen para evitar erro de sintaxe
  const emailsCadastrados = ['admin@pedeai.com', 'vendedor@teste.com', 'cliente@email.com'];

  const validarEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const processarLogin = () => {
    setErro(null);
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      setErro("Por favor, preencha todos os campos para entrar.");
      return;
    }
    handleLogin();
  };

  const processarCadastro = () => {
    setErro(null);

    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      setErro("Todos os campos básicos são obrigatórios.");
      return;
    }

    if (tipoUsuario === 'Vendedor' && !nomeLoja) {
      setErro("Vendedores precisam informar o nome do estabelecimento.");
      return;
    }

    if (!validarEmail(usuarioEmail)) {
      setErro("O formato do e-mail digitado é inválido.");
      return;
    }

    if (emailsCadastrados.includes(usuarioEmail.toLowerCase())) {
      setErro("Este e-mail já está cadastrado em nossa base.");
      return;
    }

    if (usuarioSenha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (usuarioSenha !== usuarioSenhaConfirm) {
      setErro("As senhas digitadas não coincidem.");
      return;
    }

    handleCadastro();
  };

  return (
    <div className="h-screen w-screen bg-orange-600 flex flex-col items-center justify-center p-4 font-sans text-zinc-900 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      
      <div className="max-w-md w-full bg-white rounded-[45px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500 my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase">PedeAí</h1>
          <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em]">PedeAí, pediu chegou</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl animate-in fade-in slide-in-from-top duration-300">
            <p className="text-red-700 text-xs font-bold">{erro}</p>
          </div>
        )}

        {telaAuth === 'Login' ? (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight">Bora pedir?</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Username ou E-mail" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={campoLoginIdentificacao}
                onChange={(e) => setCampoLoginIdentificacao(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Sua senha" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={campoLoginSenha}
                onChange={(e) => setCampoLoginSenha(e.target.value)}
              />
            </div>
            <button 
              onClick={processarLogin} 
              className="w-full bg-orange-600 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all"
            >
              Entrar
            </button>
            <p className="text-center text-zinc-400 font-bold text-sm">
              Ainda não tem conta? <button onClick={() => { setTelaAuth('Cadastro'); setErro(null); }} className="text-orange-600 font-black">Cadastre-se</button>
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight text-center">Criar Cadastro</h2>
            
            <div className="flex gap-2 bg-zinc-100 p-1 rounded-2xl mb-4">
              {(['Cliente', 'Vendedor', 'Admin'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => { setTipoUsuario(tipo); setErro(null); }}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${tipoUsuario === tipo ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400'}`}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Nome Completo" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioNomeCompleto}
                onChange={(e) => setUsuarioNomeCompleto(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioUsername}
                onChange={(e) => setUsuarioUsername(e.target.value)}
              />
              
              {tipoUsuario === 'Vendedor' && (
                <input 
                  type="text" 
                  placeholder="Nome do Estabelecimento" 
                  className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all animate-in slide-in-from-top duration-300" 
                  value={nomeLoja}
                  onChange={(e) => setNomeLoja(e.target.value)}
                />
              )}

              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioEmail}
                onChange={(e) => setUsuarioEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Crie uma Senha" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioSenha}
                onChange={(e) => setUsuarioSenha(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Confirme sua Senha" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioSenhaConfirm}
                onChange={(e) => setUsuarioSenhaConfirm(e.target.value)}
              />
            </div>
            <button 
              onClick={processarCadastro} 
              className="w-full bg-zinc-800 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all"
            >
              Finalizar Cadastro
            </button>
            <p className="text-center text-zinc-400 font-bold text-sm">
              Já é cliente? <button onClick={() => { setTelaAuth('Login'); setErro(null); }} className="text-orange-600 font-black">Fazer Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}