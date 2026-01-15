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
  usuarioTelefone: string;
  setUsuarioTelefone: (val: string) => void;
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
  usuarioTelefone,
  setUsuarioTelefone,
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

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const processarLogin = () => {
    setErro(null);
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      setErro("Preencha todos os campos para entrar.");
      return;
    }
    handleLogin();
  };

  const processarCadastro = () => {
    setErro(null);
    if (!usuarioNomeCompleto || !usuarioUsername || !usuarioEmail || !usuarioSenha) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }
    if (tipoUsuario === 'Vendedor' && !nomeLoja) {
      setErro("Informe o nome do estabelecimento.");
      return;
    }
    if (tipoUsuario !== 'Admin' && !usuarioTelefone) {
      setErro("O telefone é obrigatório.");
      return;
    }
    if (!validarEmail(usuarioEmail)) {
      setErro("O e-mail digitado é inválido.");
      return;
    }
    if (usuarioSenha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (usuarioSenha !== usuarioSenhaConfirm) {
      setErro("As senhas não coincidem.");
      return;
    }
    handleCadastro();
  };

  return (
    /* CORREÇÃO: min-h-screen para o fundo preencher tudo e scrollbar-hide para sumir com a barra visual */
    <div className="min-h-screen w-full bg-orange-600 flex flex-col items-center justify-start p-4 font-sans text-zinc-900 overflow-y-auto scrollbar-hide">
      
      <div className="max-w-md w-full bg-white rounded-[45px] shadow-2xl p-8 space-y-6 animate-in zoom-in duration-500 my-auto border border-white/20">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase leading-none">PedeAí</h1>
          <p className="text-orange-500 font-bold text-[9px] uppercase tracking-[0.3em]">PedeAí, pediu chegou</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl">
            <p className="text-red-700 text-[11px] font-bold">{erro}</p>
          </div>
        )}

        {telaAuth === 'Login' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight">Bora pedir?</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Username ou E-mail" 
                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                value={campoLoginIdentificacao}
                onChange={(e) => setCampoLoginIdentificacao(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Sua senha" 
                className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                value={campoLoginSenha}
                onChange={(e) => setCampoLoginSenha(e.target.value)}
              />
            </div>
            <button 
              onClick={processarLogin} 
              className="w-full bg-orange-600 text-white p-4 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-all"
            >
              Entrar
            </button>
            <p className="text-center text-zinc-400 font-bold text-[13px]">
              Ainda não tem conta? <button onClick={() => { setTelaAuth('Cadastro'); setErro(null); }} className="text-orange-600 font-black hover:underline transition-all">Cadastre-se</button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight text-center leading-none">Criar Cadastro</h2>
            
            <div className="flex gap-2 bg-zinc-100 p-1 rounded-2xl shadow-inner">
              {(['Cliente', 'Vendedor', 'Admin'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => { setTipoUsuario(tipo); setErro(null); }}
                  className={`flex-1 py-2.5 rounded-xl text-[9px] font-black transition-all ${tipoUsuario === tipo ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-500'}`}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              <input 
                type="text" 
                placeholder="Nome Completo" 
                className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                value={usuarioNomeCompleto}
                onChange={(e) => setUsuarioNomeCompleto(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                value={usuarioUsername}
                onChange={(e) => setUsuarioUsername(e.target.value)}
              />
              
              {tipoUsuario === 'Vendedor' && (
                <input 
                  type="text" 
                  placeholder="Nome do Estabelecimento" 
                  className="w-full p-3.5 bg-orange-50 border border-orange-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all animate-in slide-in-from-top duration-300 text-sm" 
                  value={nomeLoja}
                  onChange={(e) => setNomeLoja(e.target.value)}
                />
              )}

              {(tipoUsuario === 'Cliente' || tipoUsuario === 'Vendedor') && (
                <input 
                  type="tel" 
                  placeholder="Telefone / WhatsApp" 
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all animate-in slide-in-from-top duration-300 text-sm" 
                  value={usuarioTelefone}
                  onChange={(e) => setUsuarioTelefone(e.target.value)}
                />
              )}

              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                value={usuarioEmail}
                onChange={(e) => setUsuarioEmail(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="password" 
                  placeholder="Senha" 
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                  value={usuarioSenha}
                  onChange={(e) => setUsuarioSenha(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Confirmar" 
                  className="w-full p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all text-sm" 
                  value={usuarioSenhaConfirm}
                  onChange={(e) => setUsuarioSenhaConfirm(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={processarCadastro} 
              className="w-full bg-zinc-800 text-white p-4 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-all mt-2"
            >
              Finalizar Cadastro
            </button>
            
            <p className="text-center text-zinc-400 font-bold text-[13px]">
              Já é cliente? <button onClick={() => { setTelaAuth('Login'); setErro(null); }} className="text-orange-600 font-black hover:underline transition-all">Fazer Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}