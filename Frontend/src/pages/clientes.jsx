import React from "react";
import "./Home.css";

function Home() {
  const estabelecimentos = [
    {
      nome: "Barbearia Estilo Fino",
      icone: "💈",
      nota: "4,9 (201)",
      status: "Aberto",
      horario: "Seg a Sab, 08:00 as 18:00",
      aberto: true,
    },
    {
      nome: "Clínica Vida Plena",
      icone: "💝",
      nota: "4,4 (32)",
      status: "Fechado",
      horario: "Seg a Sab, 08:00 as 15:00",
      aberto: false,
    },
    {
      nome: "Salão Bella",
      icone: "💇",
      nota: "5.0 (3)",
      status: "Fechado",
      horario: "Seg a Sab, 08:00 as 15:00",
      aberto: false,
    },
    {
      nome: "Barbearia do Zé",
      icone: "💈",
      nota: "5.0 (3)",
      status: "Fechado",
      horario: "Seg a Sab, 08:00 as 15:00",
      aberto: false,
    },
    {
      nome: "Clínica Sorriso",
      icone: "💝",
      nota: "4,4 (32)",
      status: "Fechado",
      horario: "Seg a Sab, 08:00 as 15:00",
      aberto: false,
    },
  ];

  return (
    <div className="mobile-background">
      <span className="mobile-label">Mobile - Principal</span>

      <main className="mobile-screen">
        <header className="header">
          <h1>AgendaFácil</h1>
        </header>

        <section className="search-section">
          <p className="greeting">Bom dia, Nome</p>

          <div className="search-box">
            <span className="search-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="10.8" cy="10.8" r="7.2" />
                <path d="M16.2 16.2L21 21" />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Onde você quer agendar?"
            />
          </div>
        </section>

        <nav className="filters">
          <button className="filter active">Todos</button>
          <button className="filter">Barbearias</button>
          <button className="filter">Clínicas</button>
          <button className="filter">Salões</button>
        </nav>

        <section className="business-list">
          {estabelecimentos.map((estabelecimento, index) => (
            <article className="business-card" key={index}>
              <div className="business-icon">
                <span>{estabelecimento.icone}</span>
              </div>

              <div className="business-info">
                <h2>{estabelecimento.nome}</h2>

                <div className="rating">
                  <span className="star">★</span>
                  <span>{estabelecimento.nota}</span>
                </div>
              </div>

              <div className="business-status">
                <span
                  className={`status ${
                    estabelecimento.aberto ? "open" : "closed"
                  }`}
                >
                  {estabelecimento.status}
                </span>

                <p>{estabelecimento.horario}</p>
              </div>
            </article>
          ))}
        </section>

        <footer className="bottom-navigation">
          <button className="nav-item selected">
            <svg viewBox="0 0 24 24">
              <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" />
            </svg>
          </button>

          <button className="nav-item">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 3a9 9 0 1 1-8.5 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 3v6h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 7v5l3 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button className="nav-item">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7z" />
            </svg>
          </button>
        </footer>
      </main>
    </div>
  );
}

export default Home;