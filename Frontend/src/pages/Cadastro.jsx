import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Botao from '../components/Botao';
import TipoUsuario from '../components/TipoUsuario';

export default function Cadastro() {
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (Array.isArray(dados)) {
          setCidades(dados);
        }
      })
      .catch((erro) => console.error("Erro ao carregar cidades:", erro));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-slate-200 bg-white">
        <h1 className="font-black text-xl tracking-tight">
          <Link to="/">AgendaFácil</Link>
        </h1>
        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
          Voltar para o Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-8 flex flex-col my-8">
          <h2 className="text-3xl font-black mb-1 text-slate-900">Cadastro</h2>
          <p className="text-sm text-slate-500 mb-6">Escolha o tipo de conta para começar</p>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <TipoUsuario />
            
            <input 
              type="text" 
              placeholder="Nome da Empresa" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
              />
              <input 
                type="password" 
                placeholder="Confirmar" 
                className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm" 
              />
            </div>
            
            <select 
              defaultValue="" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm text-slate-500 cursor-pointer"
            >
              <option value="" disabled>Tipo de Estabelecimento</option>
              <option value="barbearia">Barbearia</option>
              <option value="clinica">Clínica</option>
            </select>

            <select 
              defaultValue="" 
              className="w-full h-11 px-4 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-sm text-slate-500 cursor-pointer"
            >
              <option value="" disabled>Cidade</option>
              {cidades?.map((cidade) => (
                <option key={cidade.id} value={cidade.nome}>
                  {cidade.nome} - {cidade?.microrregiao?.mesorregiao?.UF?.sigla || 'BR'}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="termos" 
                className="w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="termos" className="text-xs text-slate-600 cursor-pointer select-none">
                Li e aceito os Termos e a Política de Privacidade
              </label>
            </div>
            
            <Botao texto="Cadastrar" />
          </form>

          <p className="text-sm text-slate-600 text-center mt-6">
            Já possui uma conta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  );
}