import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiLogOut,
  FiScissors,
  FiUsers,
} from 'react-icons/fi';
import '../../CSS/EmpresaLayout.css';
import '../../CSS/agendafuncionario.css';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function AgendaEmpresa() {
  const navigate = useNavigate();

  const hoje = useMemo(() => new Date(), []);
  const hojeStr = useMemo(() => formatarData(hoje), [hoje]);

  const nomeEmpresa = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome da Empresa';
    } catch {
      return 'Nome da Empresa';
    }
  }, []);

  const [dataAtual, setDataAtual] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );
  const [dataSelecionada, setDataSelecionada] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  );
  const [filtroFuncionario, setFiltroFuncionario] = useState('Todos');

  const [agendamentos, setAgendamentos] = useState(() => ({
    [hojeStr]: [
      {
        id: 1,
        cliente: 'Lucas Almeida',
        servico: 'Corte de Cabelo + Barba',
        funcionario: 'Carlos',
        horario: '09:00',
        status: 'CONFIRMED',
      },
      {
        id: 2,
        cliente: 'Mariana Costa',
        servico: 'Corte e Escova',
        funcionario: 'Marina',
        horario: '10:30',
        status: 'PENDING',
      },
      {
        id: 3,
        cliente: 'Rafael Mendes',
        servico: 'Sobrancelha',
        funcionario: 'Rafael',
        horario: '14:00',
        status: 'CONFIRMED',
      },
    ],
  }));

  const dias = useMemo(() => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaAnterior = new Date(ano, mes, 0).getDate();
    const lista = [];

    for (let i = primeiroDia - 1; i >= 0; i--) {
      lista.push({ numero: ultimoDiaAnterior - i, mes: mes - 1, ano, outroMes: true });
    }
    for (let i = 1; i <= ultimoDia; i++) {
      lista.push({ numero: i, mes, ano, outroMes: false });
    }
    let proximoDia = 1;
    while (lista.length < 42) {
      lista.push({ numero: proximoDia++, mes: mes + 1, ano, outroMes: true });
    }

    return lista.map((d) => ({ ...d, data: new Date(d.ano, d.mes, d.numero) }));
  }, [dataAtual]);

  const chaveSelecionada = formatarData(dataSelecionada);

  const listaDoDia = useMemo(() => {
    const itens = agendamentos[chaveSelecionada] || [];
    if (filtroFuncionario === 'Todos') return itens;
    return itens.filter((i) => i.funcionario === filtroFuncionario);
  }, [agendamentos, chaveSelecionada, filtroFuncionario]);

  const nomeMes = dataAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  function alterarStatus(id, novoStatus) {
    setAgendamentos((prev) => ({
      ...prev,
      [chaveSelecionada]: (prev[chaveSelecionada] || []).map((ag) =>
        ag.id === id ? { ...ag, status: novoStatus } : ag
      ),
    }));
  }

  function handleSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="emp-layout">
      {/* MENU LATERAL DA EMPRESA */}
      <aside className="emp-sidebar">
        <div className="emp-sidebar-top">
          <h1 className="emp-logo">AgendaFácil</h1>

          <ul className="emp-menu">
            <li>
              <button
                type="button"
                className="emp-menu-btn is-active"
                onClick={() => navigate('/agenda-empresa')}
              >
                <FiCalendar size={18} />
                <span>Agenda</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="emp-menu-btn"
                onClick={() => navigate('/servicos')}
              >
                <FiScissors size={18} />
                <span>Serviços</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="emp-menu-btn"
                onClick={() => navigate('/funcionarios')}
              >
                <FiUsers size={18} />
                <span>Funcionários</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="emp-menu-btn"
                onClick={() => navigate('/horarios')}
              >
                <FiClock size={18} />
                <span>Horários</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="emp-sidebar-bottom">
          <div className="emp-user-box">
            <div className="emp-user-avatar">
              <FiBriefcase size={17} />
            </div>
            <div className="emp-user-info">
              <strong>{nomeEmpresa}</strong>
              <span>Administrador</span>
            </div>
          </div>

          <button type="button" className="emp-btn-sair" onClick={handleSair}>
            <FiLogOut size={17} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="emp-main">
        <div className="ag-split">
          {/* CALENDÁRIO GERAL DA EMPRESA */}
          <section className="emp-card">
            <div className="ag-cal-top">
              <h2 className="ag-title">Agenda da Empresa</h2>

              <div className="ag-cal-controls">
                <select
                  value={filtroFuncionario}
                  onChange={(e) => setFiltroFuncionario(e.target.value)}
                  className="emp-btn"
                  aria-label="Filtrar por funcionário"
                >
                  <option value="Todos">Todos os funcionários</option>
                  <option value="Carlos">Carlos</option>
                  <option value="Marina">Marina</option>
                  <option value="Rafael">Rafael</option>
                </select>
              </div>
            </div>

            <div className="ag-month-bar">
              <button
                type="button"
                className="ag-nav-arrow"
                onClick={() =>
                  setDataAtual(
                    new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1)
                  )
                }
              >
                <FiChevronLeft size={18} />
              </button>

              <h3>{nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}</h3>

              <button
                type="button"
                className="ag-nav-arrow"
                onClick={() =>
                  setDataAtual(
                    new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1)
                  )
                }
              >
                <FiChevronRight size={18} />
              </button>
            </div>

            <div className="ag-weekdays">
              {DIAS_SEMANA.map((dia) => (
                <span key={dia}>{dia}</span>
              ))}
            </div>

            <div className="ag-grid">
              {dias.map((dia, idx) => {
                const diaStr = formatarData(dia.data);
                const isSelected = diaStr === chaveSelecionada;
                const isToday = diaStr === hojeStr;
                const itensDia = (agendamentos[diaStr] || []).filter(
                  (i) =>
                    filtroFuncionario === 'Todos' ||
                    i.funcionario === filtroFuncionario
                );

                return (
                  <button
                    type="button"
                    key={idx}
                    className={`ag-cell ${dia.outroMes ? 'is-other-month' : ''} ${
                      isToday ? 'is-today' : ''
                    } ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setDataSelecionada(dia.data)}
                  >
                    <span className="ag-cell-num">
                      {String(dia.numero).padStart(2, '0')}
                    </span>

                    {itensDia.length > 0 && (
                      <span className="ag-cell-pill">
                        {itensDia.length}{' '}
                        {itensDia.length === 1 ? 'cliente' : 'clientes'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* LISTA DO DIA */}
          <section className="emp-card">
            <div className="ag-day-header">
              <div>
                <h2>{chaveSelecionada === hojeStr ? 'Hoje' : chaveSelecionada}</h2>
                <p>Agendamentos da equipe</p>
              </div>

              <span className="ag-day-count">{listaDoDia.length} horários</span>
            </div>

            <div className="ag-list">
              {listaDoDia.length > 0 ? (
                listaDoDia.map((item) => (
                  <article className="ag-item" key={item.id}>
                    <div className="ag-item-top">
                      <h3 className="ag-item-client">{item.cliente}</h3>
                      <span className="ag-item-time">{item.horario}</span>
                    </div>

                    <p className="ag-item-service">{item.servico}</p>

                    <div className="ag-item-bottom">
                      <span>Profissional: {item.funcionario}</span>
                      <span
                        className={`ag-status ${
                          item.status === 'CONFIRMED'
                            ? 'ag-status--confirmed'
                            : item.status === 'CANCELLED'
                            ? 'ag-status--cancelled'
                            : 'ag-status--pending'
                        }`}
                      >
                        {item.status === 'CONFIRMED'
                          ? 'Confirmado'
                          : item.status === 'CANCELLED'
                          ? 'Cancelado'
                          : 'Pendente'}
                      </span>
                    </div>

                    {item.status === 'PENDING' && (
                      <div className="ag-item-actions">
                        <button
                          type="button"
                          className="ag-mini-btn ag-mini-btn--ok"
                          onClick={() => alterarStatus(item.id, 'CONFIRMED')}
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="ag-mini-btn ag-mini-btn--no"
                          onClick={() => alterarStatus(item.id, 'CANCELLED')}
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="ag-empty">
                  Nenhum agendamento encontrado para esta seleção.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}