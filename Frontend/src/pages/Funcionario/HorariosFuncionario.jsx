import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiEdit2,
  FiList,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import '../../CSS/FuncionarioLayout.css';
import '../../CSS/HorariosFuncionario.css';
import { apiFetch } from '../../services/api';

const STORAGE_KEY = 'af_horarios_funcionario';

const HORARIOS_INICIAIS = [
  { id: 1, dia: 'Segunda', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 às 13:00', fim: '18:00' },
  { id: 2, dia: 'Terça', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 às 13:00', fim: '18:00' },
  { id: 3, dia: 'Quarta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 às 13:00', fim: '18:00' },
  { id: 4, dia: 'Quinta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 às 13:00', fim: '18:00' },
  { id: 5, dia: 'Sexta', estado: 'Aberto', inicio: '09:00', intervalo: '12:00 às 13:00', fim: '18:00' },
  { id: 6, dia: 'Sábado', estado: 'Aberto', inicio: '09:00', intervalo: '------', fim: '14:00' },
  { id: 7, dia: 'Domingo', estado: 'Fechado', inicio: '------', intervalo: '------', fim: '------' },
];

export default function HorariosFuncionario() {
  const navigate = useNavigate();

  const nomeColaborador = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome do Colaborador';
    } catch {
      return 'Nome do Colaborador';
    }
  }, []);

  const [horarios, setHorarios] = useState(() => {
    try {
      const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return Array.isArray(salvos) && salvos.length > 0
        ? salvos
        : HORARIOS_INICIAIS;
    } catch {
      return HORARIOS_INICIAIS;
    }
  });

  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState('');

  function alternarEstado(id) {
    if (!editando) return;
    setHorarios((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const abrir = item.estado === 'Fechado';
        return {
          ...item,
          estado: abrir ? 'Aberto' : 'Fechado',
          inicio: abrir ? '09:00' : '------',
          intervalo: abrir ? '12:00 às 13:00' : '------',
          fim: abrir ? '18:00' : '------',
        };
      })
    );
  }

  function atualizarCampo(id, campo, valor) {
    setHorarios((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  }

  function replicarSegundaParaUteis() {
    const segunda = horarios.find((h) => h.dia === 'Segunda');
    if (!segunda) return;

    const uteis = ['Terça', 'Quarta', 'Quinta', 'Sexta'];
    setHorarios((prev) =>
      prev.map((item) =>
        uteis.includes(item.dia)
          ? {
              ...item,
              estado: segunda.estado,
              inicio: segunda.inicio,
              intervalo: segunda.intervalo,
              fim: segunda.fim,
            }
          : item
      )
    );

    setAviso('Horário de Segunda aplicado de Terça a Sexta.');
    setTimeout(() => setAviso(''), 3000);
  }

  async function handleSalvar() {
    setEditando(false);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(horarios));
    } catch {
      // Ignora erro de storage
    }

    if (localStorage.getItem('token')) {
      await apiFetch('/employees/me/schedules', {
        method: 'PUT',
        body: JSON.stringify({ schedules: horarios }),
      }).catch(() => {});
    }

    setAviso('Alterações no horário de atendimento salvas com sucesso!');
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
                className="func-menu-btn"
                onClick={() => navigate('/agenda')}
              >
                <FiCalendar size={18} />
                <span>Agenda</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="func-menu-btn is-active"
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
        <div className="func-card">
          <div className="hf-header">
            <div>
              <h2 className="hf-title">Meu Horário de Atendimento</h2>
              <p className="hf-subtitle">
                Configure seus dias e turnos disponíveis para receber solicitações.
              </p>
            </div>

            <div className="hf-header-actions">
              {editando && (
                <button
                  type="button"
                  className="func-btn"
                  onClick={replicarSegundaParaUteis}
                  title="Copiar horário de Segunda para Terça a Sexta"
                >
                  <FiCopy size={15} />
                  <span>Aplicar Seg → Sex</span>
                </button>
              )}

              <button
                type="button"
                className={`func-btn hf-btn-edit-toggle ${
                  editando ? 'is-editing' : ''
                }`}
                onClick={() => setEditando((prev) => !prev)}
                aria-label="Editar horários"
              >
                {editando ? <FiCheck size={16} /> : <FiEdit2 size={16} />}
                <span>{editando ? 'Concluir Edição' : 'Editar'}</span>
              </button>
            </div>
          </div>

          {aviso && (
            <div className="func-toast" role="status">
              {aviso}
            </div>
          )}

          <div className="hf-table-wrap">
            <table className="hf-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Estado</th>
                  <th>Início</th>
                  <th>Intervalo</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                {horarios.map((item) => {
                  const isAberto = item.estado === 'Aberto';

                  return (
                    <tr key={item.id}>
                      <td className="hf-day-name">{item.dia}</td>

                      <td>
                        <button
                          type="button"
                          disabled={!editando}
                          onClick={() => alternarEstado(item.id)}
                          className={`hf-status-pill ${
                            isAberto ? 'is-open' : 'is-closed'
                          } ${editando ? 'is-editable' : ''}`}
                        >
                          {item.estado}
                        </button>
                      </td>

                      <td>
                        {editando && isAberto ? (
                          <input
                            type="time"
                            className="hf-input"
                            value={item.inicio}
                            onChange={(e) =>
                              atualizarCampo(item.id, 'inicio', e.target.value)
                            }
                          />
                        ) : (
                          item.inicio
                        )}
                      </td>

                      <td>
                        {editando && isAberto ? (
                          <input
                            type="text"
                            className="hf-input hf-input--interval"
                            value={item.intervalo}
                            onChange={(e) =>
                              atualizarCampo(
                                item.id,
                                'intervalo',
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          item.intervalo
                        )}
                      </td>

                      <td>
                        {editando && isAberto ? (
                          <input
                            type="time"
                            className="hf-input"
                            value={item.fim}
                            onChange={(e) =>
                              atualizarCampo(item.id, 'fim', e.target.value)
                            }
                          />
                        ) : (
                          item.fim
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="hf-footer">
            <button
              type="button"
              className="func-btn func-btn--primary"
              onClick={handleSalvar}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}