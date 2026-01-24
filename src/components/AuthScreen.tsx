import { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Store, 
  AtSign,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';

interface AuthProps {
  telaAuth: 'Login' | 'Cadastro' | 'Recuperar';
  setTelaAuth: (tela: 'Login' | 'Cadastro' | 'Recuperar') => void;
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
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [genero, setGenero] = useState<'Masculino' | 'Feminino' | 'Outro' | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [campoRecuperacao, setCampoRecuperacao] = useState('');
  const [etapaCadastro, setEtapaCadastro] = useState(1);

  const aplicarMascaraTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const processarLogin = () => {
    setErro(null);
    setSucesso(null);
    if (!campoLoginIdentificacao || !campoLoginSenha) {
      setErro("Preencha os campos para entrar.");
      return;
    }
    handleLogin();
  };

  const processarRecuperacao = () => {
    setErro(null);
    setSucesso(null);
    if (!campoRecuperacao) {
      setErro("Informe seu e-mail ou username.");
      return;
    }
    setSucesso("Instruções enviadas para o seu e-mail!");
    setCampoRecuperacao('');
  };

  const proximaEtapa = () => {
    setErro(null);
    if (!usuarioNomeCompleto || !usuarioUsername || !genero) {
      setErro("Preencha os dados de identificação.");
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
    setEtapaCadastro(2);
  };

  const processarCadastro = () => {
    setErro(null);
    setSucesso(null);
    if (!usuarioEmail || !usuarioSenha) {
      setErro("Preencha os dados de acesso.");
      return;
    }
    if (!validarEmail(usuarioEmail)) {
      setErro("E-mail inválido.");
      return;
    }
    if (usuarioSenha.length < 6) {
      setErro("Senha muito curta (mín. 6 caracteres).");
      return;
    }
    if (usuarioSenha !== usuarioSenhaConfirm) {
      setErro("As senhas não batem.");
      return;
    }
    handleCadastro();
  };

  return (
    <div className="min-h-screen w-full bg-orange-600 bg-[radial-gradient(circle_at_center,#ea580c_0%,#c2410c_100%)] flex flex-col items-center justify-center p-4 font-sans text-zinc-900 overflow-hidden relative">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2s-.9 2-2 2H32c-1.1 0-2-.9-2-2zM12 12c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2-.9-2-2zm0 36c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2-.9-2-2z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-md w-full bg-white rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 space-y-6 animate-in zoom-in duration-500 overflow-y-auto max-h-[95vh] scrollbar-none border border-white/20 relative z-10">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase leading-none">PedeAí</h1>
          <p className="text-orange-500 font-bold text-[9px] uppercase tracking-[0.3em]">PedeAí, pediu chegou</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            <p className="text-red-700 text-[11px] font-bold">{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            <p className="text-green-700 text-[11px] font-bold">{sucesso}</p>
          </div>
        )}

        {telaAuth === 'Login' ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Bora pedir?</h2>
            <div className="space-y-3">
              <div className="relative group">
                <AtSign className="absolute left-4 top-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Username ou E-mail" 
                  className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium transition-all text-sm" 
                  value={campoLoginIdentificacao}
                  onChange={(e) => setCampoLoginIdentificacao(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Sua senha" 
                    className="w-full p-4 pl-12 pr-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium transition-all text-sm" 
                    value={campoLoginSenha}
                    onChange={(e) => setCampoLoginSenha(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end px-1">
                  <button 
                    onClick={() => { setTelaAuth('Recuperar'); setErro(null); setSucesso(null); }}
                    className="text-[11px] font-bold text-zinc-400 hover:text-orange-600 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={processarLogin} 
              className="w-full bg-orange-600 text-white p-4 rounded-2xl font-black text-base shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Entrar <ChevronRight size={20} />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-zinc-400"><span className="bg-white px-2">ou entre com</span></div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 p-3.5 border border-zinc-200 rounded-2xl font-bold text-sm text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              Entrar com Google
            </button>

            <p className="text-center text-zinc-400 font-bold text-[13px]">
              Novo por aqui? <button onClick={() => { setTelaAuth('Cadastro'); setErro(null); setSucesso(null); setEtapaCadastro(1); }} className="text-orange-600 font-black hover:underline transition-all">Criar conta</button>
            </p>
          </div>
        ) : telaAuth === 'Recuperar' ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Recuperar acesso</h2>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">Relaxa! Informe seu e-mail ou nome de usuário e enviaremos as instruções para você criar uma nova senha.</p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="E-mail ou Username" 
                className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium transition-all text-sm" 
                value={campoRecuperacao}
                onChange={(e) => setCampoRecuperacao(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <button 
                onClick={processarRecuperacao} 
                className="w-full bg-zinc-900 text-white p-4 rounded-2xl font-black text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Enviar Instruções
              </button>
              
              <button 
                onClick={() => { setTelaAuth('Login'); setErro(null); setSucesso(null); }}
                className="w-full flex items-center justify-center gap-2 text-sm font-black text-zinc-400 hover:text-orange-600 transition-colors py-2"
              >
                <ArrowLeft size={16} /> Voltar para o Login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-none">Criar Cadastro</h2>
               <div className="flex gap-1">
                  <div className={`w-6 h-1.5 rounded-full transition-all ${etapaCadastro === 1 ? 'bg-orange-600 w-10' : 'bg-zinc-100'}`}></div>
                  <div className={`w-6 h-1.5 rounded-full transition-all ${etapaCadastro === 2 ? 'bg-orange-600 w-10' : 'bg-zinc-100'}`}></div>
               </div>
            </div>
            
            <div className="bg-zinc-100 p-1.5 rounded-[22px] shadow-inner flex items-center transition-all duration-300">
              {(['Cliente', 'Vendedor', 'Admin'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => { setTipoUsuario(tipo); setErro(null); setSucesso(null); }}
                  className={`relative z-10 flex-1 py-3 rounded-[18px] text-[10px] font-black tracking-widest transition-all duration-300 ${tipoUsuario === tipo ? 'text-white bg-orange-600 shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>

            {etapaCadastro === 1 ? (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    maxLength={40}
                    placeholder="Nome Completo" 
                    className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                    value={usuarioNomeCompleto}
                    onChange={(e) => setUsuarioNomeCompleto(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  {tipoUsuario === 'Vendedor' && (
                    <div className="relative group animate-in slide-in-from-top duration-300">
                      <Store className="absolute left-4 top-3.5 text-orange-400 group-focus-within:text-orange-600 transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder="Nome do Estabelecimento" 
                        className="w-full p-3.5 pl-11 bg-orange-50 border border-orange-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                        value={nomeLoja}
                        onChange={(e) => setNomeLoja(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className={tipoUsuario !== 'Admin' ? "grid grid-cols-2 gap-3" : "grid grid-cols-1"}>
                    <div className="relative group">
                      <AtSign className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder="Username" 
                        className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                        value={usuarioUsername}
                        onChange={(e) => setUsuarioUsername(e.target.value)}
                      />
                    </div>

                    {tipoUsuario !== 'Admin' && (
                      <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input 
                          type="tel" 
                          placeholder="(00) 00000-0000" 
                          className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                          value={usuarioTelefone}
                          onChange={(e) => setUsuarioTelefone(aplicarMascaraTelefone(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase ml-2 mb-3 tracking-[0.2em]">Gênero</p>
                  <div className="flex gap-3">
                    {(['Masculino', 'Feminino', 'Outro'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenero(g)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black border-2 transition-all active:scale-95 ${genero === g ? 'bg-orange-50 border-orange-600 text-orange-600 shadow-inner' : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                      >
                        {g.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={proximaEtapa} 
                  className="w-full bg-orange-600 text-white p-5 rounded-[22px] font-black text-base shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                    value={usuarioEmail}
                    onChange={(e) => setUsuarioEmail(e.target.value)}
                  />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="password" 
                    placeholder="Crie sua senha" 
                    className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                    value={usuarioSenha}
                    onChange={(e) => setUsuarioSenha(e.target.value)}
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="password" 
                    placeholder="Confirme a senha" 
                    className="w-full p-3.5 pl-11 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-orange-500 shadow-inner font-medium text-sm transition-all" 
                    value={usuarioSenhaConfirm}
                    onChange={(e) => setUsuarioSenhaConfirm(e.target.value)}
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button 
                    onClick={processarCadastro} 
                    className="w-full bg-zinc-900 text-white p-5 rounded-[22px] font-black text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Finalizar Cadastro
                  </button>
                  <button 
                    onClick={() => setEtapaCadastro(1)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-black text-zinc-400 hover:text-orange-600 transition-colors py-2"
                  >
                    <ArrowLeft size={16} /> Voltar para identificação
                  </button>
                </div>
              </div>
            )}
            
            <div className="bg-zinc-50 p-4 rounded-3xl text-center">
              <p className="text-zinc-400 font-bold text-[13px]">
                Já tem conta? <button onClick={() => { setTelaAuth('Login'); setErro(null); setSucesso(null); setEtapaCadastro(1); }} className="text-orange-600 font-black hover:underline transition-all">Fazer Login</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}