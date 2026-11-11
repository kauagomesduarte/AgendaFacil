import React from 'react';
import '../CSS/Servicos.css';
import { FiCalendar, FiScissors, FiUsers, FiClock, FiList, FiLogOut } from 'react-icons/fi';
export default function Servicos() {
  const listaServicos = [
    { id: 1, nome: 'Corte de Cabelo', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
    { id: 2, nome: 'Barba', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
    { id: 3, nome: 'Corte e Escova', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
    { id: 4, nome: 'Hidratação', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
    { id: 5, nome: 'Sobrancelha', duracao: '45 min', preco: 'R$ 40,00', status: 'Inativo' },
  ];

  return (
    <div className="servicos-container">
      
      {/* 1. MENU LATERAL */}
      <nav className="sidebar">
        <h2 className="logo">AgendaFácil</h2>
        <ul className="menu">
          <li><FiCalendar className="icone-menu" /> Agenda</li>
          <li className="ativo"><FiScissors className="icone-menu" /> Serviços</li>
          <li><FiUsers className="icone-menu" /> Funcionários</li>
          <li><FiClock className="icone-menu" /> Horários</li>
          <li><FiList className="icone-menu" /> Fila de espera</li>
        </ul>
        <div className="perfil-rodape">
          <div className="info-empresa">
            <strong>Nome da Empresa</strong>
            <span>Administrador</span>
          </div>
          <button className="btn-sair"><FiLogOut className="icone-menu" /> Sair</button>
        </div>
      </nav>

      {/* 2. CONTEÚDO CENTRAL (TABELA) */}
      <main className="conteudo-principal">
        <div className="card-branco">
          <h2 className="titulo-secao">Serviços</h2>
          <table className="tabela-servicos">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Duração</th>
                <th>Preço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {listaServicos.map((servico) => (
                <tr key={servico.id}>
                  <td>{servico.nome}</td>
                  <td>{servico.duracao}</td>
                  <td>{servico.preco}</td>
                  <td>{servico.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* 3. PAINEL DIREITO (AÇÕES E FILTROS) */}
      <aside className="painel-direito">
        <div className="card-branco painel-filtros">
          <h3 className="titulo-painel">Serviços</h3>
          <button className="btn-azul">Novo Serviço</button>
          
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