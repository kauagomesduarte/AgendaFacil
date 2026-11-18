import React from "react";
import "./Funcionarios.css";

const funcionarios = [
  {
    id: 1,
    nome: "Carlos",
    email: "carlos@estilofino.com",
    servico: "Corte, Barba",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Marina",
    email: "marina@estilofino.com",
    servico: "Corte e escova, Hidratação",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Rafael",
    email: "rafael@estilofino.com",
    servico: "Corte, Barba, Sobrancelha",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Beatriz",
    email: "beatriz@estilofino.com",
    servico: "Hidratação",
    status: "Inativo",
  },
];

function Funcionarios() {
  return (
    <div className="func-layout">

      {/* SIDEBAR */}
      <aside className="func-sidebar">

        <div className="func-logo">
          AgendaFácil
        </div>

        <nav className="func-menu">

          <a href="#" className="func-menu-item">
            <span className="func-icon">▢</span>
            Agenda
          </a>

          <a href="#" className="func-menu-item">
            <span className="func-icon">✂</span>
            Serviços
          </a>

          <a href="#" className="func-menu-item func-active">
            <span className="func-icon">♙</span>
            Funcionários
          </a>

          <a href="#" className="func-menu-item">
            <span className="func-icon">◷</span>
            Horários
          </a>

          <a href="#" className="func-menu-item">
            <span className="func-icon">▤</span>
            Fila de espera
          </a>

        </nav>

        {/* Área inferior */}
        <div className="func-sidebar-bottom">

          <div className="func-company">
            <span className="func-avatar">◎</span>

            <div>
              <p>Nome da Empresa</p>
              <small>Administrador</small>
            </div>
          </div>

          <button className="func-logout">
            <span>⇥</span>
            Sair
          </button>

        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="func-main">

        <section className="func-content">

          {/* CABEÇALHO */}
          <header className="func-header">

            <h1>Funcionários</h1>

            <div className="func-header-actions">

              <input
                type="text"
                placeholder="Pesquisar"
                className="func-search"
              />

              <button className="func-button">
                Filtros
              </button>

              <button className="func-edit-button" title="Editar">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M7 16.5l1.2-3.5L15.8 5.5a2 2 0 0 1 2.8 2.8L11 15.9 7 16.5z" />
                </svg>
              </button>

            </div>

          </header>

          {/* TABELA */}
          <div className="func-table-container">

            <table className="func-table">

              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Serviço</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {funcionarios.map((funcionario) => (
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

          {/* BOTÃO SALVAR */}
          <div className="func-footer">
            <button className="func-save-button">
              Salvar Alterações
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}

export default Funcionarios;