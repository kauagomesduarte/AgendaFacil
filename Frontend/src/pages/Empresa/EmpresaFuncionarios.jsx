import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiClock,
  FiEdit2,
  FiList,
  FiLogOut,
  FiPlus,
  FiScissors,
  FiSearch,
  FiUsers,
} from 'react-icons/fi';
import '../../CSS/EmpresaLayout.css';
import '../../CSS/empresafuncionarios.css';

const STORAGE_FUNCIONARIOS = 'af_empresa_funcionarios';
const STORAGE_SERVICOS = 'af_empresa_servicos';

const SERVICOS_PADRAO = [
  { id: 1, nome: 'Corte de Cabelo', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 2, nome: 'Barba', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 3, nome: 'Corte e Escova', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 4, nome: 'Hidratação', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 5, nome: 'Sobrancelha', duracao: '45 min', preco: 'R$ 40,00', status: 'Inativo' },
];

const FUNCIONARIOS_INICIAIS = [
  {
    id: 1,
    nome: 'Carlos',
    email: 'carlos@estilofino.com',
    servico: 'Corte de Cabelo, Barba',
    status: 'Ativo',
    solicitacoes: [
      {
        id: 101,
        cliente: 'Lucas Almeida',
        contato: '(99) 99123-4567',
        servico: 'Corte de Cabelo + Barba',
        dataHora: 'Hoje · 14:00',
        status: 'PENDING',
      },
      {
        id: 102,
        cliente: 'Bruno Santos',
        contato: '(99) 99204-3310',
        servico: 'Barba',
        dataHora: 'Hoje · 15:30',
        status: 'PENDING',
      },
    ],
  },
  {
    id: 2,
    nome: 'Marina',
    email: 'marina@estilofino.com',
    servico: 'Corte e Escova, Hidratação',
    status: 'Ativo',
    solicitacoes: [
      {
        id: 201,
        cliente: 'Mariana Costa',
        contato: '(99) 98845-1122',
        servico: 'Corte e Escova',
        dataHora: 'Hoje · 16:00',
        status: 'PENDING',
      },
    ],
  },
  {
    id: 3,
    nome: 'Rafael',
    email: 'rafael@estilofino.com',
    servico: 'Corte de Cabelo, Barba, Sobrancelha',
    status: 'Ativo',
    solicitacoes: [],
  },
  {
    id: 4,
    nome: 'Beatriz',
    email: 'beatriz@estilofino.com',
    servico: 'Hidratação',
    status: 'Inativo',
    solicitacoes: [],
  },
];

function lerStorage(chave, fallback) {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) || 'null');
    return Array.isArray(salvo) && salvo.length > 0 ? salvo : fallback;
  } catch {
    return fallback;
  }
}

export default function EmpresaFuncionarios() {
  const navigate = useNavigate();

  const nomeEmpresa = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome da Empresa';
    } catch {
      return 'Nome da Empresa';
    }
  }, []);

  const [funcionarios, setFuncionarios] = useState(() =>
    lerStorage(STORAGE_FUNCIONARIOS, FUNCIONARIOS_INICIAIS)
  );

  // Lista de serviços cadastrados para conectar no modal
  const servicosDisponiveis = useMemo(
    () => lerStorage(STORAGE_SERVICOS, SERVICOS_PADRAO),
    []
  );

  const [editando, setEditando] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const [aviso, setAviso] = useState('');

  // Modal Ver Fila do funcionário
  const [funcionarioFilaId, setFuncionarioFilaId] = useState(null);

  // Modal Novo Funcionário
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [servicosMarcados, setServicosMarcados] = useState([]);

  const contadores = useMemo(
    () => ({
      TODOS: funcionarios.length,
      Ativo: funcionarios.filter((f) => f.status === 'Ativo').length,
      Inativo: funcionarios.filter((f) => f.status === 'Inativo').length,
    }),
    [funcionarios]
  );

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return funcionarios.filter((f) => {
      const bateFiltro = filtro === 'TODOS' || f.status === filtro;
      const bateBusca =
        !termo ||
        f.nome.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo) ||
        f.servico.toLowerCase().includes(termo);

      return bateFiltro && bateBusca;
    });
  }, [funcionarios, busca, filtro]);

  const funcionarioSelecionado = useMemo(
    () => funcionarios.find((f) => f.id === funcionarioFilaId) || null,
    [funcionarios, funcionarioFilaId]
  );

  function atualizarCampoFuncionario(id, campo, valor) {
    setFuncionarios((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f))
    );
  }

  function alternarStatusFuncionario(e, id) {
    e.stopPropagation();
    if (!editando) return;
    setFuncionarios((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : f
      )
    );
  }

  function handleSalvarAlteracoes() {
    setEditando(false);
    try {
      localStorage.setItem(STORAGE_FUNCIONARIOS, JSON.stringify(funcionarios));
    } catch {
      // Ignora erro de storage
    }
    setAviso('Alterações nos funcionários salvas com sucesso!');
    setTimeout(() => setAviso(''), 3500);
  }

  function alternarServicoModal(nomeServico) {
    setServicosMarcados((prev) =>
      prev.includes(nomeServico)
        ? prev.filter((item) => item !== nomeServico)
        : [...prev, nomeServico]
    );
  }

  function criarFuncionario(e) {
    e.preventDefault();
    if (!novoNome.trim() || !novoEmail.trim()) return;

    const novo = {
      id: Date.now(),
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      servico:
        servicosMarcados.length > 0
          ? servicosMarcados.join(', ')
          : 'Atendimento Geral',
      status: 'Ativo',
      solicitacoes: [],
    };

    const atualizada = [...funcionarios, novo];
    setFuncionarios(atualizada);
    try {
      localStorage.setItem(STORAGE_FUNCIONARIOS, JSON.stringify(atualizada));
    } catch {
      // Ignora erro de storage
    }

    setNovoNome('');
    setNovoEmail('');
    setServicosMarcados([]);
    setModalNovoAberto(false);
    setAviso(`Funcionário ${novo.nome} cadastrado e vinculado aos serviços!`);
    setTimeout(() => setAviso(''), 3500);
  }

  function atualizarSolicitacao(funcId, solId, novoStatus) {
    setFuncionarios((prev) => {
      const atualizada = prev.map((f) => {
        if (f.id !== funcId) return f;
        return {
          ...f,
          solicitacoes:
            novoStatus === 'REMOVE'
              ? f.solicitacoes.filter((s) => s.id !== solId)
              : f.solicitacoes.map((s) =>
                  s.id === solId ? { ...s, status: novoStatus } : s
                ),
        };
      });

      try {
        localStorage.setItem(STORAGE_FUNCIONARIOS, JSON.stringify(atualizada));
      } catch {
        // Ignora erro de storage
      }
      return atualizada;
    });

    setAviso(
      novoStatus === 'CONFIRMED'
        ? 'Horário confirmado!'
        : novoStatus === 'CALLED'
        ? 'Cliente chamado!'
        : 'Cliente removido da fila.'
    );
    setTimeout(() => setAviso(''), 3000);
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
                className="emp-menu-btn"
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
                className="emp-menu-btn is-active"
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
                onClick={() => navigate('/agenda-empresa')}
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

      {/* CONTEÚDO PRINCIPAL + PAINEL DIREITO */}
      <main className="emp-main">
        {aviso && (
          <div className="emp-toast" role="status">
            {aviso}
          </div>
        )}

        <div className="emp-split">
          {/* TABELA DE FUNCIONÁRIOS */}
          <section className="emp-card">
            <div className="emp-card-top">
              <div>
                <h2 className="emp-title">Funcionários</h2>
                <p className="emp-subtitle">
                  {editando
                    ? 'Edite os dados diretamente na tabela e clique em Salvar Alterações.'
                    : 'Clique em um funcionário ou no lápis para editar os dados.'}
                </p>
              </div>

              <button
                type="button"
                className={`emp-btn ${editando ? 'is-editing' : ''}`}
                onClick={() => setEditando((prev) => !prev)}
                title={editando ? 'Concluir edição' : 'Editar funcionários'}
              >
                {editando ? <FiCheck size={16} /> : <FiEdit2 size={16} />}
                <span>{editando ? 'Editando' : 'Editar'}</span>
              </button>
            </div>

            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Serviço</th>
                    <th>Status</th>
                    <th>Fila</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.length > 0 ? (
                    listaFiltrada.map((func) => (
                      <tr
                        key={func.id}
                        onClick={() => {
                          if (!editando) setEditando(true);
                        }}
                      >
                        <td>
                          {editando ? (
                            <input
                              type="text"
                              className="emp-inline-input"
                              value={func.nome}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoFuncionario(
                                  func.id,
                                  'nome',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span className="ef-name-text">{func.nome}</span>
                          )}
                        </td>

                        <td>
                          {editando ? (
                            <input
                              type="email"
                              className="emp-inline-input"
                              value={func.email}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoFuncionario(
                                  func.id,
                                  'email',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            func.email
                          )}
                        </td>

                        <td>
                          {editando ? (
                            <input
                              type="text"
                              className="emp-inline-input"
                              value={func.servico}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoFuncionario(
                                  func.id,
                                  'servico',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            func.servico
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={(e) =>
                              alternarStatusFuncionario(e, func.id)
                            }
                            className={`emp-status-badge ${
                              func.status === 'Ativo'
                                ? 'emp-status-badge--active'
                                : 'emp-status-badge--inactive'
                            } ${editando ? 'is-editable' : ''}`}
                            title={
                              editando
                                ? 'Clique para alternar Ativo/Inativo'
                                : 'Ative o modo de edição para alterar o status'
                            }
                          >
                            {func.status}
                          </button>
                        </td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="ef-queue-btn"
                            onClick={() => setFuncionarioFilaId(func.id)}
                          >
                            <FiList size={14} />
                            <span>Ver Fila</span>
                            <span className="ef-queue-count">
                              {func.solicitacoes.length}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: 'center',
                          padding: '2rem',
                          color: '#64748b',
                        }}
                      >
                        Nenhum funcionário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="emp-card-footer">
              <button
                type="button"
                className="emp-btn emp-btn--primary"
                onClick={handleSalvarAlteracoes}
              >
                Salvar Alterações
              </button>
            </div>
          </section>

          {/* PAINEL DIREITO: AÇÕES E FILTROS */}
          <aside className="emp-side-card">
            <h3 className="emp-side-title">Funcionários</h3>

            <button
              type="button"
              className="emp-btn emp-btn--primary emp-btn--full"
              onClick={() => {
                setServicosMarcados([]);
                setModalNovoAberto(true);
              }}
            >
              <FiPlus size={16} />
              <span>Novo Funcionário</span>
            </button>

            <div className="emp-search-box">
              <FiSearch size={15} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar funcionário"
                aria-label="Pesquisar funcionário"
              />
            </div>

            <div className="emp-filter-group">
              <span className="emp-filter-label">Status</span>

              <button
                type="button"
                className={`emp-filter-pill ${
                  filtro === 'TODOS' ? 'is-active' : ''
                }`}
                onClick={() => setFiltro('TODOS')}
              >
                <span>Todos</span>
                <span className="emp-filter-count">{contadores.TODOS}</span>
              </button>

              <button
                type="button"
                className={`emp-filter-pill ${
                  filtro === 'Ativo' ? 'is-active' : ''
                }`}
                onClick={() => setFiltro('Ativo')}
              >
                <span>Ativos</span>
                <span className="emp-filter-count">{contadores.Ativo}</span>
              </button>

              <button
                type="button"
                className={`emp-filter-pill ${
                  filtro === 'Inativo' ? 'is-active' : ''
                }`}
                onClick={() => setFiltro('Inativo')}
              >
                <span>Inativos</span>
                <span className="emp-filter-count">{contadores.Inativo}</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* MODAL: FILA DO FUNCIONÁRIO */}
      {funcionarioSelecionado && (
        <div
          className="emp-modal-backdrop"
          onClick={() => setFuncionarioFilaId(null)}
        >
          <div
            className="emp-modal emp-modal--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-modal-header">
              <div>
                <h3>Fila de Atendimento — {funcionarioSelecionado.nome}</h3>
                <p>Serviços: {funcionarioSelecionado.servico}</p>
              </div>

              <button
                type="button"
                className="emp-modal-close"
                onClick={() => setFuncionarioFilaId(null)}
              >
                ×
              </button>
            </div>

            {funcionarioSelecionado.solicitacoes.length > 0 ? (
              <div className="ef-queue-list">
                {funcionarioSelecionado.solicitacoes.map((sol) => {
                  const isPending = sol.status === 'PENDING';

                  return (
                    <div key={sol.id} className="ef-queue-item">
                      <div className="ef-queue-info">
                        <strong>
                          {sol.cliente} · {sol.servico}
                        </strong>
                        <span>
                          {sol.dataHora} · {sol.contato}
                        </span>
                      </div>

                      <div className="ef-queue-actions">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              className="ef-q-btn ef-q-btn--confirm"
                              onClick={() =>
                                atualizarSolicitacao(
                                  funcionarioSelecionado.id,
                                  sol.id,
                                  'CONFIRMED'
                                )
                              }
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              className="ef-q-btn ef-q-btn--reject"
                              onClick={() =>
                                atualizarSolicitacao(
                                  funcionarioSelecionado.id,
                                  sol.id,
                                  'REMOVE'
                                )
                              }
                            >
                              Recusar
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="emp-status-badge emp-status-badge--active">
                              {sol.status === 'CALLED'
                                ? 'Chamado'
                                : 'Confirmado'}
                            </span>

                            {sol.status !== 'CALLED' && (
                              <button
                                type="button"
                                className="ef-q-btn ef-q-btn--call"
                                onClick={() =>
                                  atualizarSolicitacao(
                                    funcionarioSelecionado.id,
                                    sol.id,
                                    'CALLED'
                                  )
                                }
                              >
                                Chamar
                              </button>
                            )}

                            <button
                              type="button"
                              className="ef-q-btn ef-q-btn--reject"
                              onClick={() =>
                                atualizarSolicitacao(
                                  funcionarioSelecionado.id,
                                  sol.id,
                                  'REMOVE'
                                )
                              }
                            >
                              Remover
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: '#64748b',
                  margin: 0,
                }}
              >
                Nenhum cliente na fila de {funcionarioSelecionado.nome}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: NOVO FUNCIONÁRIO + LISTA DE SERVIÇOS PARA CONECTAR */}
      {modalNovoAberto && (
        <div
          className="emp-modal-backdrop"
          onClick={() => setModalNovoAberto(false)}
        >
          <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3>Novo Funcionário</h3>
              <button
                type="button"
                className="emp-modal-close"
                onClick={() => setModalNovoAberto(false)}
              >
                ×
              </button>
            </div>

            <form className="emp-modal-form" onSubmit={criarFuncionario}>
              <div className="emp-field">
                <label htmlFor="ef-nome">Nome do Funcionário</label>
                <input
                  id="ef-nome"
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Gabriel Martins"
                  required
                />
              </div>

              <div className="emp-field">
                <label htmlFor="ef-email">E-mail de Acesso</label>
                <input
                  id="ef-email"
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="gabriel@empresa.com"
                  required
                />
              </div>

              <div className="emp-field">
                <label>Conectar aos Serviços da Empresa</label>
                <div className="emp-connect-list">
                  {servicosDisponiveis.map((srv) => {
                    const marcado = servicosMarcados.includes(srv.nome);

                    return (
                      <label
                        key={srv.id}
                        className={`emp-connect-item ${
                          marcado ? 'is-checked' : ''
                        }`}
                      >
                        <span className="emp-connect-left">
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() => alternarServicoModal(srv.nome)}
                          />
                          <span>{srv.nome}</span>
                        </span>
                        <span className="emp-connect-meta">
                          {srv.duracao} · {srv.preco}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="emp-btn emp-btn--primary emp-btn--full"
              >
                Cadastrar Funcionário
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}