import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Função que verifica o link atual para aplicar a classe 'ativo'
  const isActive = (path) => {
    return location.pathname === path ? 'menu-item ativo' : 'menu-item';
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <h1>AgendaFácil</h1>
      </div>

      <nav className="sidebar-nav">
        <Link to="/agenda" className={isActive('/agenda')}>
          <span className="icone">📅</span> Agenda
        </Link>
        <Link to="/servicos" className={isActive('/servicos')}>
          <span className="icone">✂️</span> Serviços
        </Link>
        <Link to="/funcionarios" className={isActive('/funcionarios')}>
          <span className="icone">👤</span> Funcionários
        </Link>
        <Link to="/horarios" className={isActive('/horarios')}>
          <span className="icone">🕒</span> Horários
        </Link>
        <Link to="/fila" className={isActive('/fila')}>
          <span className="icone">📋</span> Fila de espera
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="usuario-info">
          <span className="icone-usuario">🧑‍💼</span>
          <div className="texto-usuario">
            <strong>Nome da Empresa</strong>
            <span>Administrador</span>
          </div>
        </div>
        <button className="btn-sair">
          <span className="icone">🚪</span> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
