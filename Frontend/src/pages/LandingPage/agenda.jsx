import React from "react";
import "./Agenda.css";

const dias = [
  "01", "02", "03", "04", "05", "06", "07",
  "08", "09", "10", "11", "12", "13", "14",
  "15", "16", "17", "18", "19", "20", "21",
  "22", "23", "24", "25", "26", "27", "28",
  "29", "30", "01", "02", "03", "04", "05",
  "06", "07", "08", "09", "10", "11", "12",
];

const compromissos = [
  { horario: "09:00", cliente: "Cliente", servico: "Serviço", funcionario: "Funcionario", status: "Status" },
  { horario: "10:00", cliente: "Cliente", servico: "Serviço", funcionario: "Funcionario", status: "Status" },
  { horario: "11:00", cliente: "Cliente", servico: "Serviço", funcionario: "Funcionario", status: "Status" },
  { horario: "12:00", cliente: "Cliente", servico: "Serviço", funcionario: "Funcionario", status: "Status" },
  { horario: "13:00", cliente: "Cliente", servico: "Serviço", funcionario: "Funcionario", status: "Status" },
];

function Agenda() {
  return (
    <div className="agenda-layout">

      {/* SIDEBAR */}
      <aside className="agenda-sidebar">

        <div className="agenda-logo">
          AgendaFácil
        </div>

        <nav className="agenda-menu">

          <a href="#" className="agenda-menu-item agenda-active">
            <span className="agenda-icon">▣</span>
            Agenda
          </a>

          <a href="#" className="agenda-menu-item">
            <span className="agenda-icon">✂</span>
            Serviços
          </a>

          <a href="#" className="agenda-menu-item">
            <span className="agenda-icon">♙</span>
            Funcionários
          </a>

          <a href="#" className="agenda-menu-item">
            <span className="agenda-icon">◷</span>
            Horários
          </a>

          <a href="#" className="agenda-menu-item">
            <span className="agenda-icon">▤</span>
            Fila de espera
          </a>

        </nav>

        {/* RODAPÉ */}
        <div className="agenda-sidebar-bottom">

          <div className="agenda-company">
            <span className="agenda-avatar">◎</span>

            <div>
              <p>Nome da Empresa</p>
              <small>Administrador</small>
            </div>
          </div>

          <button className="agenda-logout">
            <span>⇥</span>
            Sair
          </button>

        </div>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="agenda-main">

        {/* CALENDÁRIO */}
        <section className="agenda-calendar-card">

          <h1>Agenda</h1>

          <h2 className="agenda-month">
            Novembro 2026
          </h2>

          <div className="agenda-calendar-grid">

            {dias.map((dia, index) => (
              <div
                key={index}
                className={`agenda-day ${
                  index >= 30 ? "agenda-next-month" : ""
                }`}
              >
                <span>{dia}</span>
              </div>
            ))}

          </div>

        </section>

        {/* COMPROMISSOS DO DIA */}
        <aside className="agenda-today-card">

          <h2>Hoje</h2>

          <div className="agenda-appointments">

            {compromissos.map((compromisso, index) => (
              <article className="agenda-appointment" key={index}>

                <div className="appointment-details">

                  <strong>{compromisso.cliente}</strong>

                  <span>{compromisso.servico}</span>

                  <span>{compromisso.funcionario}</span>

                </div>

                <div className="appointment-time">

                  <strong>{compromisso.horario}</strong>

                  <span className="appointment-status">
                    {compromisso.status}
                  </span>

                </div>

              </article>
            ))}

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Agenda;