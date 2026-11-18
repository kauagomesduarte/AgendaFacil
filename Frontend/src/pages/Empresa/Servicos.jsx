import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiClock,
  FiEdit2,
  FiLogOut,
  FiPlus,
  FiScissors,
  FiSearch,
  FiUsers,
} from 'react-icons/fi';
import '../../CSS/EmpresaLayout.css';

const STORAGE_SERVICOS = 'af_empresa_servicos';
const STORAGE_FUNCIONARIOS = 'af_empresa_funcionarios';

const SERVICOS_INICIAIS = [
  { id: 1, nome: 'Corte de Cabelo', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 2, nome: 'Barba', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 3, nome: 'Corte e Escova', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 4, nome: 'Hidratação', duracao: '45 min', preco: 'R$ 40,00', status: 'Ativo' },
  { id: 5, nome: 'Sobrancelha', duracao: '45 min', preco: 'R$ 40,00', status: 'Inativo' },
];

const FUNCIONARIOS_PADRAO = [
  { id: 1, nome: 'Carlos', email: 'carlos@estilofino.com', servico: 'Corte de Cabelo, Barba', status: 'Ativo', solicitacoes: [] },
  { id: 2, nome: 'Marina', email: 'marina@estilofino.com', servico: 'Corte e Escova, Hidratação', status: 'Ativo', solicitacoes: [] },
  { id: 3, nome: 'Rafael', email: 'rafael@estilofino.com', servico: 'Corte de Cabelo, Barba, Sobrancelha', status: 'Ativo', solicitacoes: [] },
  { id: 4, nome: 'Beatriz', email: 'beatriz@estilofino.com', servico: 'Hidratação', status: 'Inativo', solicitacoes: [] },
];

function lerStorage(chave, fallback) {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) || 'null');
    return Array.isArray(salvo) && salvo.length > 0 ? salvo : fallback;
  } catch {
    return fallback;
  }
}

export default function Servicos() {
  const navigate = useNavigate();

  const nomeEmpresa = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome da Empresa';
    } catch {
      return 'Nome da Empresa';
    }
  }, []);

  const [servicos, setServicos] = useState(() =>
    lerStorage(STORAGE_SERVICOS, SERVICOS_INICIAIS)
  );
  const [editando, setEditando] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const [aviso, setAviso] = useState('');

  // Modal Novo Serviço + Funcionários para conectar
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDuracao, setNovaDuracao] = useState('45 min');
  const [novoPreco, setNovoPreco] = useState('R$ 50,00');
  const [funcionariosMarcados, setFuncionariosMarcados] = useState([]);

  const funcionariosDisponiveis = useMemo(
    () => lerStorage(STORAGE_FUNCIONARIOS, FUNCIONARIOS_PADRAO),
    [modalAberto]
  );

  const contadores = useMemo(
    () => ({
      TODOS: servicos.length,
      Ativo: servicos.filter((s) => s.status === 'Ativo').length,
      Inativo: servicos.filter((s) => s.status === 'Inativo').length,
    }),
    [servicos]
  );

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return servicos.filter((s) => {
      const bateStatus = filtro === 'TODOS' || s.status === filtro;
      const bateBusca =
        !termo ||
        s.nome.toLowerCase().includes(termo) ||
        s.preco.toLowerCase().includes(termo);
      return bateStatus && bateBusca;
    });
  }, [servicos, busca, filtro]);

  function atualizarCampoServico(id, campo, valor) {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [campo]: valor } : s))
    );
  }

  function alternarStatusServico(e, id) {
    e.stopPropagation();
    if (!editando) return;
    setServicos((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : s
      )
    );
  }

  function handleSalvarAlteracoes() {
    setEditando(false);
    try {
      localStorage.setItem(STORAGE_SERVICOS, JSON.stringify(servicos));
    } catch {
      // Ignora erro de storage
    }
    setAviso('Alterações nos serviços salvas com sucesso!');
    setTimeout(() => setAviso(''), 3500);
  }

  function alternarFuncionarioModal(funcId) {
    setFuncionariosMarcados((prev) =>
      prev.includes(funcId)
        ? prev.filter((id) => id !== funcId)
        : [...prev, funcId]
    );
  }

  function adicionarServico(e) {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const nomeLimpo = novoNome.trim();
    const novo = {
      id: Date.now(),
      nome: nomeLimpo,
      duracao: novaDuracao.trim() || '30 min',
      preco: novoPreco.trim() || 'R$ 40,00',
      status: 'Ativo',
    };

    const listaServicosAtualizada = [...servicos, novo];
    setServicos(listaServicosAtualizada);

    try {
      localStorage.setItem(
        STORAGE_SERVICOS,
        JSON.stringify(listaServicosAtualizada)
      );

      // Conecta o novo serviço aos funcionários marcados
      if (funcionariosMarcados.length > 0) {
        const funcsAtuais = lerStorage(
          STORAGE_FUNCIONARIOS,
          FUNCIONARIOS_PADRAO
        );
        const funcsAtualizados = funcsAtuais.map((f) => {
          if (!funcionariosMarcados.includes(f.id)) return f;
          const servicosAtuais = f.servico
            ? f.servico.split(',').map((s) => s.trim())
            : [];
          if (!servicosAtuais.includes(nomeLimpo)) {
            servicosAtuais.push(nomeLimpo);
          }
          return { ...f, servico: servicosAtuais.join(', ') };
        });
        localStorage.setItem(
          STORAGE_FUNCIONARIOS,
          JSON.stringify(funcsAtualizados)
        );
      }
    } catch {
      // Ignora erro de storage
    }

    setNovoNome('');
    setFuncionariosMarcados([]);
    setModalAberto(false);
    setAviso(
      funcionariosMarcados.length > 0
        ? `Serviço "${nomeLimpo}" cadastrado e vinculado a ${funcionariosMarcados.length} funcionário(s)!`
        : `Serviço "${nomeLimpo}" cadastrado!`
    );
    setTimeout(() => setAviso(''), 3500);
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
                className="emp-menu-btn is-active"
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

      {/* CONTEÚDO PRINCIPAL + PAINEL DIREITO */}
      <main className="emp-main">
        {aviso && (
          <div className="emp-toast" role="status">
            {aviso}
          </div>
        )}

        <div className="emp-split">
          {/* TABELA DE SERVIÇOS */}
          <section className="emp-card">
            <div className="emp-card-top">
              <div>
                <h2 className="emp-title">Serviços</h2>
                <p className="emp-subtitle">
                  {editando
                    ? 'Edite nome, duração, preço ou status e clique em Salvar Alterações.'
                    : 'Clique em um serviço ou no lápis para editar.'}
                </p>
              </div>

              <button
                type="button"
                className={`emp-btn ${editando ? 'is-editing' : ''}`}
                onClick={() => setEditando((prev) => !prev)}
                title={editando ? 'Concluir edição' : 'Editar serviços'}
              >
                {editando ? <FiCheck size={16} /> : <FiEdit2 size={16} />}
                <span>{editando ? 'Editando' : 'Editar'}</span>
              </button>
            </div>

            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Duração</th>
                    <th>Preço</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.length > 0 ? (
                    listaFiltrada.map((servico) => (
                      <tr
                        key={servico.id}
                        onClick={() => {
                          if (!editando) setEditando(true);
                        }}
                      >
                        <td>
                          {editando ? (
                            <input
                              type="text"
                              className="emp-inline-input"
                              value={servico.nome}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoServico(
                                  servico.id,
                                  'nome',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>
                              {servico.nome}
                            </span>
                          )}
                        </td>

                        <td>
                          {editando ? (
                            <input
                              type="text"
                              className="emp-inline-input emp-inline-input--sm"
                              value={servico.duracao}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoServico(
                                  servico.id,
                                  'duracao',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            servico.duracao
                          )}
                        </td>

                        <td>
                          {editando ? (
                            <input
                              type="text"
                              className="emp-inline-input emp-inline-input--sm"
                              value={servico.preco}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                atualizarCampoServico(
                                  servico.id,
                                  'preco',
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            servico.preco
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={(e) =>
                              alternarStatusServico(e, servico.id)
                            }
                            className={`emp-status-badge ${
                              servico.status === 'Ativo'
                                ? 'emp-status-badge--active'
                                : 'emp-status-badge--inactive'
                            } ${editando ? 'is-editable' : ''}`}
                            title={
                              editando
                                ? 'Clique para alternar Ativo/Inativo'
                                : 'Ative o modo de edição para alterar o status'
                            }
                          >
                            {servico.status}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: 'center',
                          padding: '2rem',
                          color: '#64748b',
                        }}
                      >
                        Nenhum serviço encontrado.
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
            <h3 className="emp-side-title">Serviços</h3>

            <button
              type="button"
              className="emp-btn emp-btn--primary emp-btn--full"
              onClick={() => {
                setFuncionariosMarcados([]);
                setModalAberto(true);
              }}
            >
              <FiPlus size={16} />
              <span>Novo Serviço</span>
            </button>

            <div className="emp-search-box">
              <FiSearch size={15} />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar serviço"
                aria-label="Pesquisar serviço"
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

      {/* MODAL NOVO SERVIÇO + LISTA DE FUNCIONÁRIOS PARA CONECTAR */}
      {modalAberto && (
        <div
          className="emp-modal-backdrop"
          onClick={() => setModalAberto(false)}
        >
          <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="emp-modal-header">
              <h3>Novo Serviço</h3>
              <button
                type="button"
                className="emp-modal-close"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>
            </div>

            <form className="emp-modal-form" onSubmit={adicionarServico}>
              <div className="emp-field">
                <label htmlFor="srv-nome">Nome do Serviço</label>
                <input
                  id="srv-nome"
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Corte Degradê"
                  required
                />
              </div>

              <div className="emp-field">
                <label htmlFor="srv-dur">Duração estimada</label>
                <input
                  id="srv-dur"
                  type="text"
                  value={novaDuracao}
                  onChange={(e) => setNovaDuracao(e.target.value)}
                  placeholder="Ex: 45 min"
                  required
                />
              </div>

              <div className="emp-field">
                <label htmlFor="srv-preco">Preço</label>
                <input
                  id="srv-preco"
                  type="text"
                  value={novoPreco}
                  onChange={(e) => setNovoPreco(e.target.value)}
                  placeholder="Ex: R$ 45,00"
                  required
                />
              </div>

              <div className="emp-field">
                <label>Conectar aos Funcionários que realizam</label>
                <div className="emp-connect-list">
                  {funcionariosDisponiveis.map((func) => {
                    const marcado = funcionariosMarcados.includes(func.id);

                    return (
                      <label
                        key={func.id}
                        className={`emp-connect-item ${
                          marcado ? 'is-checked' : ''
                        }`}
                      >
                        <span className="emp-connect-left">
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() => alternarFuncionarioModal(func.id)}
                          />
                          <span>{func.nome}</span>
                        </span>
                        <span className="emp-connect-meta">{func.status}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="emp-btn emp-btn--primary emp-btn--full"
              >
                Cadastrar Serviço
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}