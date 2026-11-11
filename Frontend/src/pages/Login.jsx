import { Link } from 'react-router-dom';
import Botao from '../components/Botao';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-slate-200 bg-white">
        <h1 className="font-black text-xl tracking-tight">
          <Link to="/">AgendaFácil</Link>
        </h1>
        <Link to="/cadastro" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
          Cadastro
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-8 flex flex-col">
          <h2 className="text-3xl font-black mb-1 text-slate-900">Login</h2>
          <p className="text-sm text-slate-500 mb-8">Faça login para acessar a plataforma</p>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
            />

            <Botao texto="Entrar" />
          </form>
          
          <div className="mt-6 flex flex-col gap-2 text-center">
            <p className="text-sm text-slate-600">
              Ainda não possui uma conta? <Link to="/cadastro" className="text-blue-600 font-semibold hover:underline">Cadastre-se</Link>
            </p>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Esqueci meu email ou senha
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}