import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Servicos.css';
import { FiCalendar, FiClock, FiList, FiLogOut } from 'react-icons/fi';

export default function MeusHorarios() {
  const navigate = useNavigate();

  const listaMeusHorarios = [
    { id: 1, dia: 'Segunda', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 ás 13:00', fim: '18:00' },
    { id: 2, dia: 'Terça', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 ás 13:00', fim: '18:00' },
    { id: 3, dia: 'Quarta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 ás 13:00', fim: '18:00' },
    { id: 4, dia: 'Quinta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 ás 13:00', fim: '18:00' },
    { id: 5, dia: 'Sexta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 ás 13:00', fim: '18:00' },
    { id: 6, dia: 'Sábado', estado: 'Aberto', inicio: '09:00', intervalo: '------', fim: '14:00' },
    { id: 7, dia: 'Domingo', estado: 'Fechado', inicio: '------', intervalo: '------', fim: '------' },
  ];

  return (
    <div className="servicos-container">
      
      {/* 1. MENU LATERAL */}
      <nav className="sidebar">
        <h2 className="logo">AgendaFácil</h2>
        <ul className="menu">
          <li onClick={() => navigate('/agenda')}><FiCalendar className="icone-menu" /> Agenda</li>
          <li className="ativo" onClick={() => navigate('/meus-horarios')}><FiClock className="icone-menu" /> Meus Horários</li>
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

      {/* 2. CONTEÚDO CENTRAL */}
      <main className="conteudo-principal">
        <div className="card-branco">
          
          <div className="cabecalho-tabela-topo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 className="titulo-secao" style={{ margin: 0 }}>Meu Horário de Atendimento</h2>
            <button className="btn-icone" style={{ height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              ✏️
            </button>
          </div>

          <table className="tabela-servicos">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Intervalo</th>
                <th>Fim</th>
              </tr>
            </thead>
            <tbody>
              {listaMeusHorarios.map((item) => (
                <tr key={item.id}>
                  <td>{item.dia}</td>
                  <td>{item.estado}</td>
                  <td>{item.inicio}</td>
                  <td>{item.intervalo}</td>
                  <td>{item.fim}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rodape-tabela" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button className="btn-salvar" style={{ padding: '12px 28px', backgroundColor: '#E2E8F0', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, color: '#333', cursor: 'pointer' }}>
              Salvar Alterações
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}