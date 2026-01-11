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
  handleLogin,
  handleCadastro
}: AuthProps) {
  return (
    <div className="min-h-screen bg-orange-600 flex flex-col items-center justify-center p-6 font-sans text-zinc-900">
      <div className="max-w-md w-full bg-white rounded-[45px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase">PedeAí</h1>
          <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em]">PedeAí, pediu chegou</p>
        </div>

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
            <button onClick={handleLogin} className="w-full bg-orange-600 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all">Entrar</button>
            <p className="text-center text-zinc-400 font-bold text-sm">
              Ainda não tem conta? <button onClick={() => setTelaAuth('Cadastro')} className="text-orange-600 font-black">Cadastre-se</button>
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-zinc-800 tracking-tight">Criar Cadastro</h2>
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
                placeholder="Username desejado" 
                className="w-full p-5 bg-zinc-100 border-none rounded-3xl outline-none focus:ring-2 ring-orange-400 font-medium transition-all" 
                value={usuarioUsername}
                onChange={(e) => setUsuarioUsername(e.target.value)}
              />
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
            </div>
            <button onClick={handleCadastro} className="w-full bg-zinc-800 text-white p-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all">Finalizar Cadastro</button>
            <p className="text-center text-zinc-400 font-bold text-sm">
              Já é cliente? <button onClick={() => setTelaAuth('Login')} className="text-orange-600 font-black">Fazer Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}