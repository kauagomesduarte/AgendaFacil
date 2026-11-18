import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiList,
  FiLogOut,
  FiPlus,
  FiUser,
} from 'react-icons/fi';
import '../../CSS/FuncionarioLayout.css';
import '../../CSS/AgendaFuncionario.css';
import { apiFetch } from '../../services/api';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function obterStatusBadge(status) {
  if (status === 'CONFIRMED') {
    return { texto: 'Confirmado', classe: 'ag-status--confirmed' };
  }
  if (status === 'CANCELLED' || status === 'REJECTED') {
    return { texto: 'Cancelado', classe: 'ag-status--cancelled' };
  }
  return { texto: 'Pendente', classe: 'ag-status--pending' };
}

export default function AgendaFuncionario() {
  const navigate = useNavigate();

  const hoje = useMemo(() => new Date(), []);
  const hojeStr = useMemo(() => formatarData(hoje), [hoje]);

  const nomeColaborador = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome do Colaborador';
    } catch {
      return 'Nome do Colaborador';
    }
  }, []);

  const [dataAtual, setDataAtual] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );
  const [dataSelecionada, setDataSelecionada] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  );

  const [agendamentos, setAgendamentos] = useState(() => ({
    [hojeStr]: [
      {
        id: 'ag-1',
        cliente: 'Lucas Almeida',
        servico: 'Corte + Barba',
        funcionario: nomeColaborador,
        horario: '09:00',
        status: 'CONFIRMED',
      },
      {
        id: 'ag-2',
        cliente: 'Mariana Costa',
        servico: 'Corte e Escova',
        funcionario: nomeColaborador,
        horario: '10:00',
        status: 'PENDING',
      },
      {
        id: 'ag-3',
        cliente: 'Rafael Mendes',
        servico: 'Corte Masculino',
        funcionario: nomeColaborador,
        horario: '11:00',
        status: 'CONFIRMED',
      },
      {
        id: 'ag-4',
        cliente: 'Camila Rocha',
        servico: 'Hidratação Capilar',
        funcionario: nomeColaborador,
        horario: '14:00',
        status: 'PENDING',
      },
    ],
  }));

  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState('');
  const [novoServico, setNovoServico] = useState('Corte Masculino');
  const [novoHorario, setNovoHorario] = useState('15:00');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let ativo = true;
    apiFetch('/booking/appointments')
      .then((lista) => {
        if (!ativo || !Array.isArray(lista) || lista.length === 0) return;

        const agrupados = {};
        lista.forEach((ag) => {
          const dataKey = ag.startAt ? ag.startAt.slice(0, 10) : hojeStr;
          if (!agrupados[dataKey]) agrupados[dataKey] = [];
          agrupados[dataKey].push({
            id: ag.id,
            isRealApi: true,
            cliente: ag.customerName || 'Cliente',
            servico: ag.serviceNameAtBooking || 'Serviço',
            funcionario: ag.employeeName || nomeColaborador,
            horario: ag.startAt ? ag.startAt.slice(11, 16) : '--:--',
            status: ag.status || 'PENDING',
          });
        });

        setAgendamentos(agrupados);
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, [hojeStr, nomeColaborador]);

  const dias = useMemo(() => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaAnterior = new Date(ano, mes, 0).getDate();

    const lista = [];

    for (let i = primeiroDia - 1; i >= 0; i--) {
      lista.push({
        numero: ultimoDiaAnterior - i,
        mes: mes - 1,
        ano,
        outroMes: true,
      });
    }

    for (let i = 1; i <= ultimoDia; i++) {
      lista.push({
        numero: i,
        mes,
        ano,
        outroMes: false,
      });
    }

    let proximoDia = 1;
    while (lista.length < 42) {
      lista.push({
        numero: proximoDia++,
        mes: mes + 1,
        ano,
        outroMes: true,
      });
    }

    return lista.map((d) => ({
      ...d,
      data: new Date(d.ano, d.mes, d.numero),
    }));
  }, [dataAtual]);

  const nomeMes = dataAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const chaveSelecionada = formatarData(dataSelecionada);
  const listaDoDia = useMemo(() => {
    return [...(agendamentos[chaveSelecionada] || [])].sort((a, b) =>
      a.horario.localeCompare(b.horario)
    );
  }, [agendamentos, chaveSelecionada]);

  const tituloPainelDia =
    chaveSelecionada === hojeStr
      ? 'Hoje'
      : dataSelecionada.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
        });

  async function alterarStatus(item, novoStatus) {
    if (item.isRealApi) {
      const acao = novoStatus === 'CONFIRMED' ? 'confirm' : 'cancel';
      await apiFetch(`/booking/appointments/${item.id}/${acao}`, {
        method: 'POST',
      }).catch(() => {});
    }

    setAgendamentos((prev) => ({
      ...prev,
      [chaveSelecionada]: (prev[chaveSelecionada] || []).map((ag) =>
        ag.id === item.id ? { ...ag, status: novoStatus } : ag
      ),
    }));

    setAviso(
      novoStatus === 'CONFIRMED'
        ? `Horário de ${item.cliente} confirmado.`
        : `Solicitação de ${item.cliente} recusada.`
    );
    setTimeout(() => setAviso(''), 3500);
  }

  function adicionarEncaixe(e) {
    e.preventDefault();
    if (!novoCliente.trim()) return;

    const novoItem = {
      id: Date.now(),
      cliente: novoCliente.trim(),
      servico: novoServico.trim() || 'Atendimento',
      funcionario: nomeColaborador,
      horario: novoHorario,
      status: 'CONFIRMED',
    };

    setAgendamentos((prev) => ({
      ...prev,
      [chaveSelecionada]: [...(prev[chaveSelecionada] || []), novoItem],
    }));

    setNovoCliente('');
    setModalAberto(false);
    setAviso(`Encaixe de ${novoItem.cliente} adicionado às ${novoHorario}.`);
    setTimeout(() => setAviso(''), 3500);
  }

  function handleSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="func-layout">
      {/* MENU LATERAL */}
      <aside className="func-sidebar">
        <div className="func-sidebar-top">
          <h1 className="func-logo">AgendaFácil</h1>

          <ul className="func-menu">
            <li>
              <button
                type="button"
                className="func-menu-btn is-active"
                onClick={() => navigate('/agenda')}
              >
                <FiCalendar size={18} />
                <span>Agenda</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="func-menu-btn"
                onClick={() => navigate('/horarios-funcionario')}
              >
                <FiClock size={18} />
                <span>Meus Horários</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="func-menu-btn"
                onClick={() => navigate('/fila-espera')}
              >
                <FiList size={18} />
                <span>Fila de espera</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="func-sidebar-bottom">
          <div className="func-user-box">
            <div className="func-user-avatar">
              <FiUser size={18} />
            </div>
            <div className="func-user-info">
              <strong>{nomeColaborador}</strong>
              <span>Funcionário</span>
            </div>
          </div>

          <button type="button" className="func-btn-sair" onClick={handleSair}>
            <FiLogOut size={17} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="func-main">
        {aviso && (
          <div className="func-toast" role="status">
            {aviso}
          </div>
        )}

        <div className="ag-split">
          {/* CARD ESQUERDO: CALENDÁRIO */}
          <section className="func-card">
            <div className="ag-cal-top">
              <h2 className="ag-title">Agenda</h2>

              <div className="ag-cal-controls">
                <button
                  type="button"
                  className="func-btn"
                  onClick={() => {
                    setDataAtual(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
                    setDataSelecionada(
                      new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
                    );
                  }}
                >
                  Hoje
                </button>

                <button
                  type="button"
                  className="func-btn func-btn--primary"
                  onClick={() => setModalAberto(true)}
                >
                  <FiPlus size={16} />
                  <span>Novo Encaixe</span>
                </button>
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
                aria-label="Mês anterior"
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
                aria-label="Próximo mês"
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
                const itensDia = agendamentos[diaStr] || [];
                const temPendente = itensDia.some((i) => i.status === 'PENDING');

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
                      <span
                        className={`ag-cell-pill ${
                          temPendente ? 'has-pending' : ''
                        }`}
                      >
                        {itensDia.length}{' '}
                        {itensDia.length === 1 ? 'cliente' : 'clientes'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* CARD DIREITO: ATENDIMENTOS DO DIA */}
          <section className="func-card">
            <div className="ag-day-header">
              <div>
                <h2>{tituloPainelDia}</h2>
                <p>
                  {dataSelecionada.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <span className="ag-day-count">
                {listaDoDia.length}{' '}
                {listaDoDia.length === 1 ? 'agendamento' : 'agendamentos'}
              </span>
            </div>

            <div className="ag-list">
              {listaDoDia.length > 0 ? (
                listaDoDia.map((item) => {
                  const statusBadge = obterStatusBadge(item.status);
                  const isPending = item.status === 'PENDING';

                  return (
                    <article className="ag-item" key={item.id}>
                      <div className="ag-item-top">
                        <h3 className="ag-item-client">{item.cliente}</h3>
                        <span className="ag-item-time">{item.horario}</span>
                      </div>

                      <p className="ag-item-service">{item.servico}</p>

                      <div className="ag-item-bottom">
                        <span>{item.funcionario}</span>
                        <span className={`ag-status ${statusBadge.classe}`}>
                          {statusBadge.texto}
                        </span>
                      </div>

                      {isPending && (
                        <div className="ag-item-actions">
                          <button
                            type="button"
                            className="ag-mini-btn ag-mini-btn--ok"
                            onClick={() => alterarStatus(item, 'CONFIRMED')}
                          >
                            Confirmar pedido
                          </button>
                          <button
                            type="button"
                            className="ag-mini-btn ag-mini-btn--no"
                            onClick={() => alterarStatus(item, 'CANCELLED')}
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="ag-empty">
                  Nenhum agendamento marcado para esta data.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* MODAL NOVO ENCAIXE */}
      {modalAberto && (
        <div
          className="func-modal-backdrop"
          onClick={() => setModalAberto(false)}
        >
          <div className="func-modal" onClick={(e) => e.stopPropagation()}>
            <div className="func-modal-header">
              <h3>Novo Encaixe ({tituloPainelDia})</h3>
              <button
                type="button"
                className="func-modal-close"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>
            </div>

            <form className="func-modal-form" onSubmit={adicionarEncaixe}>
              <div className="func-field">
                <label htmlFor="ag-cliente">Nome do Cliente</label>
                <input
                  id="ag-cliente"
                  type="text"
                  value={novoCliente}
                  onChange={(e) => setNovoCliente(e.target.value)}
                  placeholder="Ex: João Pedro"
                  required
                />
              </div>

              <div className="func-field">
                <label htmlFor="ag-servico">Serviço</label>
                <input
                  id="ag-servico"
                  type="text"
                  value={novoServico}
                  onChange={(e) => setNovoServico(e.target.value)}
                  placeholder="Ex: Corte Masculino"
                  required
                />
              </div>

              <div className="func-field">
                <label htmlFor="ag-hora">Horário</label>
                <input
                  id="ag-hora"
                  type="time"
                  value={novoHorario}
                  onChange={(e) => setNovoHorario(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="func-btn func-btn--primary">
                Adicionar à Agenda
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}