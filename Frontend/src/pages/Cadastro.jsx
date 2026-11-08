import { useState, useEffect } from 'react';
import Botao from '../components/Botao';
import TipoUsuario from '../components/TipoUsuario';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  // Estado para armazenar a lista de cidades que virá do IBGE
  const [cidades, setCidades] = useState([]);

  // Puxa os dados da API do IBGE assim que a tela abre
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
      .then((resposta) => resposta.json())
      .then((dados) => setCidades(dados))
      .catch((erro) => console.error("Erro ao carregar cidades:", erro));
  }, []);

  return (
    <>
      <header>
        <h1>AgendaFacil</h1>
        <Link to="/">Voltar para o Login</Link>
      </header>

      <main>
        {/* Adicionei o paddingBottom aqui para dar o respiro extra na borda de baixo */}
        <div className="container" style={{ paddingBottom: '40px' }}>
          <h2>Cadastro</h2>
          <p className="subtitulo">Escolha o tipo de conta para começar</p>

          <TipoUsuario />
          <input type="text" placeholder="Nome da Empresa" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <input type="password" placeholder="Confirmar Senha" />
          
          <select className="w-[300px] h-[40px] border-b border-[rgba(102,102,102,0.185)] outline-none text-gray-500 bg-transparent mt-2">
              <option value="" disabled selected>Tipo De Estabelecimento</option>
              <option value="barbearia">Barbearia</option>
              <option value="clinica">Clínica</option>
          </select>

          {/* Select de Cidades alimentado pela API do IBGE */}
          <select className="w-[300px] h-[40px] border-b border-[rgba(102,102,102,0.185)] outline-none text-gray-500 bg-transparent mt-2">
              <option value="" disabled selected>Cidade</option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.nome}>
                  {/* Puxa o nome da cidade e a sigla do Estado (ex: Imperatriz - MA) */}
                  {cidade.nome} - {cidade.microrregiao.mesorregiao.UF.sigla}
                </option>
              ))}
          </select>

          <div className="w-[300px] mt-4 mb-2" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="termos" 
              style={{ width: '16px', height: '16px', margin: '0', cursor: 'pointer' }}
            />
            <label htmlFor="termos" style={{ fontSize: '11px', color: '#4b5563', cursor: 'pointer', lineHeight: '1.2' }}>
              Li E Aceito Os Termos E A Política De Privacidade
            </label>
          </div>
          
          <Botao texto="Cadastrar"/>

          <p style={{ fontSize: '12px', marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>
            Já Possui Uma Conta? <Link to="/" style={{ color: '#2563EB', textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
      </main>
    </>
  );
}