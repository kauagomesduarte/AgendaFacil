import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiFilter,
  FiList,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import '../../CSS/FuncionarioLayout.css';
import '../../CSS/FilaDeEspera.css';

const FILA_INICIAL = [
  {
    id: 1,
    cliente: 'Rafaela',
    contato: '(99) 99123-4567',
    servico: 'Corte',
    dataDesejada: '19/11 - Manhã',
    status: 'Aguardando',
  },
  {
    id: 2,
    cliente: 'Diego',
    contato: '(99) 98845-1122',
    servico: 'Hidratação',
    dataDesejada: '19/11 - Tarde',
    status: 'Chamado',
  },
  {
    id: 3,
    cliente: 'Camila',
    contato: '(99) 98412-9087',
    servico: 'Sobrancelha',
    dataDesejada: '20/11 - Tarde',
    status: 'Aguardando',
  },
  {
    id: 4,
    cliente: 'Bruno',
    contato: '(99) 99204-3310',
    servico: 'Barba',
    dataDesejada: '20/11 - Qualquer',
    status: 'Aguardando',
  },
];

const STATUS_OPCOES = ['Todos', 'Aguardando', 'Chamado'];

export default function FilaDeEspera() {
  const navigate = useNavigate();

  const nomeColaborador = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome do Colaborador';
    } catch {
      return 'Nome do Colaborador';
    }
  }, []);

  const [fila, setFila] = useState(FILA_INICIAL);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [menuFiltroAberto, setMenuFiltroAberto] = useState(false);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [aviso, setAviso] = useState('');

  // Modal de adicionar à fila
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState('');
  const [novoContato, setNovoContato] = useState('');
  const [novoServico, setNovoServico] = useState('');
  const [novaDataDesejada, setNovaDataDesejada] = useState('Hoje - Qualquer');

  const filaFiltrada = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return fila.filter((item) => {
      const bateStatus =
        filtroStatus === 'Todos' || item.status === filtroStatus;
      const bateBusca =
        !termo ||
        item.cliente.toLowerCase().includes(termo) ||
        item.contato.toLowerCase().includes(termo) ||
        item.servico.toLowerCase().includes(termo) ||
        item.dataDesejada.toLowerCase().includes(termo);

      return bateStatus && bateBusca;
    });
  }, [fila, pesquisa, filtroStatus]);

  function chamarCliente(item) {
    if (!item) return;

    setFila((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: 'Chamado' } : p))
    );
    setAviso(`Cliente ${item.cliente} chamado para atendimento (${item.servico}).`);
    setTimeout(() => setAviso(''), 4000);
  }

  function removerCliente(item) {
    if (!item) return;

    setFila((prev) => prev.filter((p) => p.id !== item.id));
    if (selecionadoId === item.id) setSelecionadoId(null);
    setAviso(`${item.cliente} removido da fila de espera.`);
    setTimeout(() => setAviso(''), 3500);
  }

  function handleChamarToolbar() {
    const alvo =
      fila.find((i) => i.id === selecionadoId) ||
      fila.find((i) => i.status === 'Aguardando');

    if (alvo) chamarCliente(alvo);
  }

  function handleRemoverToolbar() {
    const alvo = fila.find((i) => i.id === selecionadoId);
    if (alvo) removerCliente(alvo);
  }

  function adicionarNaFila(e) {
    e.preventDefault();
    if (!novoCliente.trim()) return;

    const novoItem = {
      id: Date.now(),
      cliente: novoCliente.trim(),
      contato: novoContato.trim() || '(00) 00000-0000',
      servico: novoServico.trim() || 'Atendimento',
      dataDesejada: novaDataDesejada.trim() || 'Qualquer horário',
      status: 'Aguardando',
    };

    setFila((prev) => [...prev, novoItem]);
    setNovoCliente('');
    setNovoContato('');
    setNovoServico('');
    setModalAberto(false);
    setAviso(`${novoItem.cliente} adicionado à fila de espera.`);
    setTimeout(() => setAviso(''), 3500);
  }

  function handleSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const aguardandoTotal = fila.filter((i) => i.status === 'Aguardando').length;
  const itemSelecionado = fila.find((i) => i.id === selecionadoId);

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
                className="func-menu-btn is-active"
                onClick={() => navigate('/fila-espera')}
              >
                <FiList size={18} />
                <span>Fila de espera</span>
                {aguardandoTotal > 0 && (
                  <span className="func-menu-badge">{aguardandoTotal}</span>
                )}
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
          {/* BARRA SUPERIOR DA FILA */}
          <div className="fe-toolbar">
            <h2 className="fe-title">Fila de Espera</h2>

            <div className="fe-controls">
              <div className="fe-search">
                <FiSearch size={15} className="fe-search-icon" />
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar"
                  aria-label="Pesquisar na fila de espera"
                />
              </div>

              <div className="fe-filter-wrap">
                <button
                  type="button"
                  className="func-btn"
                  onClick={() => setMenuFiltroAberto((prev) => !prev)}
                >
                  <FiFilter size={15} />
                  <span>
                    {filtroStatus === 'Todos' ? 'Filtros' : filtroStatus}
                  </span>
                </button>

                {menuFiltroAberto && (
                  <div className="fe-filter-dropdown">
                    {STATUS_OPCOES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`fe-filter-option ${
                          filtroStatus === st ? 'is-active' : ''
                        }`}
                        onClick={() => {
                          setFiltroStatus(st);
                          setMenuFiltroAberto(false);
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="func-btn func-btn--primary"
                disabled={
                  !itemSelecionado &&
                  !fila.some((i) => i.status === 'Aguardando')
                }
                onClick={handleChamarToolbar}
                title={
                  itemSelecionado
                    ? `Chamar ${itemSelecionado.cliente}`
                    : 'Chamar próximo da fila'
                }
              >
                <FiBell size={15} />
                <span>Chamar</span>
              </button>

              <button
                type="button"
                className="func-btn func-btn--danger"
                disabled={!itemSelecionado}
                onClick={handleRemoverToolbar}
                title="Selecione uma linha para remover"
              >
                <FiTrash2 size={15} />
                <span>Remover</span>
              </button>

              <button
                type="button"
                className="func-btn"
                onClick={() => setModalAberto(true)}
                title="Adicionar cliente na fila"
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          {aviso && (
            <div className="func-toast" role="status">
              {aviso}
            </div>
          )}

          {/* TABELA DE CLIENTES NA FILA */}
          <div className="fe-table-wrap">
            <table className="fe-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Contato</th>
                  <th>Serviço</th>
                  <th>Data Desejada</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filaFiltrada.length > 0 ? (
                  filaFiltrada.map((item, index) => {
                    const isSelected = item.id === selecionadoId;
                    const isChamado = item.status === 'Chamado';

                    return (
                      <tr
                        key={item.id}
                        className={`fe-row ${isSelected ? 'is-selected' : ''}`}
                        onClick={() =>
                          setSelecionadoId(isSelected ? null : item.id)
                        }
                      >
                        <td className="fe-pos">{index + 1}</td>
                        <td className="fe-client-name">{item.cliente}</td>
                        <td>{item.contato}</td>
                        <td>{item.servico}</td>
                        <td>{item.dataDesejada}</td>
                        <td>
                          <span
                            className={`fe-badge ${
                              isChamado
                                ? 'fe-badge--called'
                                : 'fe-badge--waiting'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="fe-row-actions">
                            <button
                              type="button"
                              className="fe-icon-btn fe-icon-btn--call"
                              onClick={() => chamarCliente(item)}
                              title="Chamar cliente"
                            >
                              <FiBell size={14} />
                            </button>
                            <button
                              type="button"
                              className="fe-icon-btn fe-icon-btn--remove"
                              onClick={() => removerCliente(item)}
                              title="Remover da fila"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="fe-empty">
                      Nenhum cliente encontrado na fila de espera.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL ADICIONAR À FILA */}
      {modalAberto && (
        <div
          className="func-modal-backdrop"
          onClick={() => setModalAberto(false)}
        >
          <div className="func-modal" onClick={(e) => e.stopPropagation()}>
            <div className="func-modal-header">
              <h3>Adicionar à Fila de Espera</h3>
              <button
                type="button"
                className="func-modal-close"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>
            </div>

            <form className="func-modal-form" onSubmit={adicionarNaFila}>
              <div className="func-field">
                <label htmlFor="fe-cliente">Nome do Cliente</label>
                <input
                  id="fe-cliente"
                  type="text"
                  value={novoCliente}
                  onChange={(e) => setNovoCliente(e.target.value)}
                  placeholder="Ex: Fernanda Souza"
                  required
                />
              </div>

              <div className="func-field">
                <label htmlFor="fe-contato">Contato (WhatsApp / Telefone)</label>
                <input
                  id="fe-contato"
                  type="text"
                  value={novoContato}
                  onChange={(e) => setNovoContato(e.target.value)}
                  placeholder="(99) 99999-9999"
                />
              </div>

              <div className="func-field">
                <label htmlFor="fe-servico">Serviço desejado</label>
                <input
                  id="fe-servico"
                  type="text"
                  value={novoServico}
                  onChange={(e) => setNovoServico(e.target.value)}
                  placeholder="Ex: Corte e Escova"
                  required
                />
              </div>

              <div className="func-field">
                <label htmlFor="fe-data">Data / Turno desejado</label>
                <input
                  id="fe-data"
                  type="text"
                  value={novaDataDesejada}
                  onChange={(e) => setNovaDataDesejada(e.target.value)}
                  placeholder="Ex: 21/11 - Manhã"
                />
              </div>

              <button type="submit" className="func-btn func-btn--primary">
                Inserir na Fila
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}