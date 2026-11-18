import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Funcionarios.css';
import { FiCalendar, FiScissors, FiUsers, FiClock, FiList, FiLogOut } from 'react-icons/fi';

export default function Funcionarios() {
  const navigate = useNavigate();

  const listaFuncionarios = [
    { id: 1, nome: 'Carlos', email: 'carlos@estilofino.com', servico: 'Corte, Barba', status: 'Ativo' },
    { id: 2, nome: 'Marina', email: 'marina@estilofino.com', servico: 'Corte e escova, Hidratação', status: 'Ativo' },
    { id: 3, nome: 'Rafael', email: 'rafael@estilofino.com', servico: 'Corte, Barba, Sobrancelha', status: 'Ativo' },
    { id: 4, nome: 'Beatriz', email: 'beatriz@estilofino.com', servico: 'Hidratação', status: 'Inativo' },
  ];

  return (
    <div className="servicos-container">
      
      {/* 1. MENU LATERAL */}
      <nav className="sidebar">
        <h2 className="logo">AgendaFácil</h2>
        <ul className="menu">
          <li onClick={() => navigate('/agenda')}><FiCalendar className="icone-menu" /> Agenda</li>
          <li onClick={() => navigate('/servicos')}><FiScissors className="icone-menu" /> Serviços</li>
          <li className="ativo" onClick={() => navigate('/funcionarios')}><FiUsers className="icone-menu" /> Funcionários</li>
          <li onClick={() => navigate('/horarios')}><FiClock className="icone-menu" /> Horários</li>
          <li onClick={() => navigate('/fila-espera')}><FiList className="icone-menu" /> Fila de espera</li>
        </ul>
        <div className="perfil-rodape">
          <div className="info-empresa">
            <strong>Nome da Empresa</strong>
            <span>Administrador</span>
          </div>
          <button className="btn-sair" onClick={() => navigate('/')}><FiLogOut className="icone-menu" /> Sair</button>
        </div>
      </nav>

      {/* 2. CONTEÚDO CENTRAL (TABELA) */}
      <main className="conteudo-principal">
        <div className="card-branco">
          <h2 className="titulo-secao">Funcionários</h2>
          <table className="tabela-servicos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Serviço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listaFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.servico}</td>
                  <td>{funcionario.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* 3. PAINEL DIREITO (AÇÕES E FILTROS) */}
      <aside className="painel-direito">
        <div className="card-branco painel-filtros">
          <h3 className="titulo-painel">Funcionários</h3>
          <button className="btn-azul">Novo Funcionário</button>
          
          <input type="text" placeholder="Campo pesquisa" className="input-pesquisa" />

          <div className="filtro-placeholder">Filtro</div>
          <div className="filtro-placeholder">Filtro</div>
          <div className="filtro-placeholder">Filtro</div>
          <div className="filtro-placeholder">Filtro</div>
        </div>
      </aside>

    </div>
  );
}