import React from "react";
import "./FilaEspera.css";

const clientes = [
  {
    id: 1,
    nome: "Rafaela",
    contato: "00 0000-0000",
    servico: "Corte",
    funcionario: "Carlos",
    data: "05/11 - Manhã",
    status: "Aguardando",
  },
  {
    id: 2,
    nome: "Diego",
    contato: "00 0000-0000",
    servico: "Hidratação",
    funcionario: "Carlos",
    data: "05/11 - Tarde",
    status: "Chamado",
  },
  {
    id: 3,
    nome: "Camila",
    contato: "00 0000-0000",
    servico: "Sobrancelha",
    funcionario: "Marina",
    data: "06/11 - Tarde",
    status: "Aguardando",
  },
  {
    id: 4,
    nome: "Bruno",
    contato: "00 0000-0000",
    servico: "Barba",
    funcionario: "Marina",
    data: "06/11 - Qualquer",
    status: "Aguardando",
  },
];

function FilaEspera() {
  return (
    <div className="fila-layout">

      {/* Sidebar */}
      <aside className="fila-sidebar">

        <div className="fila-logo">
          AgendaFácil
        </div>

        <nav className="fila-menu">

          <a href="#" className="fila-menu-item">
            <span className="fila-menu-icon">▢</span>
            <span>Agenda</span>
          </a>

          <a href="#" className="fila-menu-item">
            <span className="fila-menu-icon">✂</span>
            <span>Serviços</span>
          </a>

          <a href="#" className="fila-menu-item">
            <span className="fila-menu-icon">♙</span>
            <span>Funcionários</span>
          </a>

          <a href="#" className="fila-menu-item">
            <span className="fila-menu-icon">◷</span>
            <span>Horários</span>
          </a>

          <a href="#" className="fila-menu-item fila-menu-active">
            <span className="fila-menu-icon">▤</span>
            <span>Fila de espera</span>
          </a>

        </nav>

        <div className="fila-sidebar-bottom">

          <div className="fila-empresa">
            <div className="fila-avatar">◎</div>

            <div className="fila-empresa-info">
              <span>Nome da Empresa</span>
              <small>Administrador</small>
            </div>
          </div>

          <button className="fila-sair">
            <span>⇥</span>
            Sair
          </button>

        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="fila-main">

        <section className="fila-container">

          {/* Topo */}
          <header className="fila-header">

            <h1>Fila de Espera</h1>

            <div className="fila-actions">

              <input
                type="text"
                className="fila-search"
                placeholder="Pesquisar"
              />

              <button className="fila-button">
                Filtros
              </button>

              <button className="fila-button">
                Chamar
              </button>

              <button className="fila-button">
                Remover
              </button>

            </div>

          </header>

          {/* Tabela */}
          <div className="fila-table-wrapper">

            <table className="fila-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Contato</th>
                  <th>Serviço</th>
                  <th>Func.</th>
                  <th>Data Desejada</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.contato}</td>
                    <td>{cliente.servico}</td>
                    <td>{cliente.funcionario}</td>
                    <td>{cliente.data}</td>
                    <td>{cliente.status}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default FilaEspera;