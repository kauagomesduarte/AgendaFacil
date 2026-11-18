import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/clientes.css';
import { apiFetch } from '../../services/api';

const CATEGORIAS = ['Todos', 'Barbearias', 'Clínicas', 'Salões'];

const ESTABELECIMENTOS_PADRAO = [
  {
    id: 'demo-1',
    nome: 'Barbearia Estilo Fino',
    categoria: 'Barbearias',
    tipoIcone: 'barbearia',
    nota: '4,9 (201)',
    aberto: true,
    horario: 'Seg a Sab, 08:00 as 18:00',
    servicos: [
      { id: 1, nome: 'Corte Masculino', preco: 'R$ 45,00', duracao: '40 min' },
      { id: 2, nome: 'Corte + Barba', preco: 'R$ 70,00', duracao: '60 min' },
    ],
  },
  {
    id: 'demo-2',
    nome: 'Clínica Vida Plena',
    categoria: 'Clínicas',
    tipoIcone: 'clinica',
    nota: '4,4 (32)',
    aberto: false,
    horario: 'Seg a Sab, 08:00 as 15:00',
    servicos: [
      { id: 3, nome: 'Consulta Geral', preco: 'R$ 150,00', duracao: '45 min' },
      { id: 4, nome: 'Avaliação Preventiva', preco: 'R$ 110,00', duracao: '30 min' },
    ],
  },
  {
    id: 'demo-3',
    nome: 'Salão Bella',
    categoria: 'Salões',
    tipoIcone: 'salao',
    nota: '5.0 (3)',
    aberto: false,
    horario: 'Seg a Sab, 08:00 as 15:00',
    servicos: [
      { id: 5, nome: 'Corte e Escova', preco: 'R$ 95,00', duracao: '60 min' },
      { id: 6, nome: 'Hidratação Capilar', preco: 'R$ 80,00', duracao: '45 min' },
    ],
  },
  {
    id: 'demo-4',
    nome: 'Barbearia do Zé',
    categoria: 'Barbearias',
    tipoIcone: 'barbearia',
    nota: '5.0 (3)',
    aberto: false,
    horario: 'Seg a Sab, 08:00 as 15:00',
    servicos: [
      { id: 7, nome: 'Corte Social', preco: 'R$ 40,00', duracao: '30 min' },
      { id: 8, nome: 'Barba na Navalha', preco: 'R$ 35,00', duracao: '30 min' },
    ],
  },
  {
    id: 'demo-5',
    nome: 'Clínica Sorriso',
    categoria: 'Clínicas',
    tipoIcone: 'clinica',
    nota: '4,4 (32)',
    aberto: false,
    horario: 'Seg a Sab, 08:00 as 15:00',
    servicos: [
      { id: 9, nome: 'Limpeza Odontológica', preco: 'R$ 130,00', duracao: '40 min' },
      { id: 10, nome: 'Avaliação Ortodôntica', preco: 'R$ 90,00', duracao: '30 min' },
    ],
  },
];

const HORARIOS_DISPONIVEIS = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];

function IconeEstabelecimento({ tipo }) {
  if (tipo === 'clinica') {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 13.5c-2.6-2.1-4.5-3.8-4.5-5.7A2.8 2.8 0 0 1 10.3 5c1 0 1.9.5 2.4 1.3A2.9 2.9 0 0 1 15.2 5 2.8 2.8 0 0 1 18 7.8c0 1.9-1.9 3.6-4.5 5.7l-.75.6-.75-.6z" />
        <path d="M3 16.5l3.5-2.2c.8-.5 1.8-.4 2.5.1l2.2 1.6h3.3a1.5 1.5 0 0 1 0 3h-4.2l-1.8-.8-.6 1.3 2.5 1.1h5.1l3.6-2.3a1.4 1.4 0 0 1 1.6 2.3l-4.4 2.9c-.5.3-1 .5-1.6.5H9.2l-4.6-2-1.6-5.5z" />
      </svg>
    );
  }

  if (tipo === 'salao') {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 3l3 2v4H6V5l1-2zm-1 7h4v11H6V10zm6 6h7a2 2 0 0 1 2 2v3H12v-5zm0-2.5c0-.8.7-1.5 1.5-1.5h4c.8 0 1.5.7 1.5 1.5V15h-7v-1.5z" />
      </svg>
    );
  }

  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="3.5" r="1.5" />
      <rect x="8" y="5.5" width="8" height="2" rx="1" />
      <path d="M9 8.5h6v10H9v-10zm1.2 1.5v2l3.6-2v-1.2l-3.6 1.2zm0 4v2l3.6-2v-2l-3.6 2z" />
      <rect x="8" y="19.5" width="8" height="2" rx="1" />
    </svg>
  );
}

function inferirCategoria(nome = '') {
  const n = nome.toLowerCase();
  if (n.includes('clínica') || n.includes('clinica') || n.includes('odonto') || n.includes('médic')) {
    return { categoria: 'Clínicas', tipoIcone: 'clinica' };
  }
  if (n.includes('salão') || n.includes('salao') || n.includes('beleza') || n.includes('estética')) {
    return { categoria: 'Salões', tipoIcone: 'salao' };
  }
  return { categoria: 'Barbearias', tipoIcone: 'barbearia' };
}

export default function Clientes() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [estabelecimentos, setEstabelecimentos] = useState(ESTABELECIMENTOS_PADRAO);

  // Modal de solicitação de horário
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [servicosModal, setServicosModal] = useState([]);
  const [servicoEscolhido, setServicoEscolhido] = useState(null);
  const [dataEscolhida, setDataEscolhida] = useState(() => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split('T')[0];
  });
  const [horarioEscolhido, setHorarioEscolhido] = useState('09:00');
  const [avisoSucesso, setAvisoSucesso] = useState('');
  const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);

  const nomeCliente = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome do Cliente';
    } catch {
      return 'Nome do Cliente';
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    let locaisPendentes = 0;
    try {
      const locais = JSON.parse(
        localStorage.getItem('af_solicitacoes_cliente') || '[]'
      );
      locaisPendentes = locais.filter(
        (item) => item.status !== 'CANCELLED' && item.status !== 'REJECTED'
      ).length;
      setTotalSolicitacoes(locaisPendentes);
    } catch {
      // Ignora erro de storage
    }

    apiFetch('/comp')
      .then((empresasApi) => {
        if (!ativo || !Array.isArray(empresasApi) || empresasApi.length === 0) return;

        const formatadas = empresasApi.map((emp) => {
          const { categoria, tipoIcone } = inferirCategoria(emp.name);
          return {
            id: emp.id,
            isRealApi: true,
            nome: emp.name,
            categoria,
            tipoIcone,
            nota: '4,9 (Novo)',
            aberto: true,
            horario: 'Seg a Sab, 08:00 as 18:00',
            servicos: [],
          };
        });

        setEstabelecimentos(formatadas);
      })
      .catch(() => {});

    apiFetch('/booking/appointments')
      .then((lista) => {
        if (ativo && Array.isArray(lista)) {
          setTotalSolicitacoes(locaisPendentes + lista.length);
        }
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  const estabelecimentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return estabelecimentos.filter((item) => {
      const bateCategoria =
        categoriaAtiva === 'Todos' || item.categoria === categoriaAtiva;
      const bateBusca =
        !termo ||
        item.nome.toLowerCase().includes(termo) ||
        item.categoria.toLowerCase().includes(termo);

      return bateCategoria && bateBusca;
    });
  }, [estabelecimentos, busca, categoriaAtiva]);

  async function abrirSolicitacao(estabelecimento) {
    setEmpresaSelecionada(estabelecimento);
    setHorarioEscolhido('09:00');

    if (estabelecimento.isRealApi) {
      try {
        const servicosApi = await apiFetch(`/comp/${estabelecimento.id}/serv`);
        if (Array.isArray(servicosApi) && servicosApi.length > 0) {
          const lista = servicosApi.map((s) => ({
            id: s.id,
            nome: s.name,
            preco: `R$ ${Number(s.price).toFixed(2).replace('.', ',')}`,
            duracao: `${s.durationMinutes} min`,
          }));
          setServicosModal(lista);
          setServicoEscolhido(lista[0]);
          return;
        }
      } catch {
        // Fallback abaixo
      }
    }

    const listaFallback =
      estabelecimento.servicos?.length > 0
        ? estabelecimento.servicos
        : [{ id: 1, nome: 'Atendimento Padrão', preco: 'R$ 50,00', duracao: '40 min' }];

    setServicosModal(listaFallback);
    setServicoEscolhido(listaFallback[0]);
  }

  function enviarSolicitacaoHorario(e) {
    e.preventDefault();
    if (!empresaSelecionada || !servicoEscolhido) return;

    const novaSolicitacao = {
      id: Date.now(),
      isRealApi: false,
      empresa: empresaSelecionada.nome,
      servico: servicoEscolhido.nome,
      preco: servicoEscolhido.preco || '',
      data: dataEscolhida,
      horario: horarioEscolhido,
      status: 'PENDING',
    };

    try {
      const anteriores = JSON.parse(
        localStorage.getItem('af_solicitacoes_cliente') || '[]'
      );
      localStorage.setItem(
        'af_solicitacoes_cliente',
        JSON.stringify([novaSolicitacao, ...anteriores])
      );
    } catch {
      // Ignora erro de storage
    }

    setEmpresaSelecionada(null);
    setTotalSolicitacoes((prev) => prev + 1);
    setAvisoSucesso(
      `Solicitação enviada para ${novaSolicitacao.empresa} (${dataEscolhida} às ${horarioEscolhido}). Aguarde a aprovação do estabelecimento.`
    );

    setTimeout(() => setAvisoSucesso(''), 5000);
  }

  function handleSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const primeiroNome =
    nomeCliente === 'Nome do Cliente' ? 'Cliente' : nomeCliente.split(' ')[0];

  return (
    <div className="cli-layout">
      {/* SIDEBAR PARA VISUALIZAÇÃO PC */}
      <aside className="cli-sidebar">
        <div className="cli-sidebar-top">
          <h1 className="cli-sidebar-logo">AgendaFácil</h1>

          <nav className="cli-sidebar-nav" aria-label="Navegação principal">
            <button
              type="button"
              className="cli-sidebar-item is-selected"
              onClick={() => navigate('/clientes')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" />
              </svg>
              <span>Início</span>
            </button>

            <button
              type="button"
              className="cli-sidebar-item"
              onClick={() => navigate('/meus-horarios')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3a9 9 0 1 1-8.5 12" />
                <path d="M3 3v6h6" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Meus Horários</span>
              {totalSolicitacoes > 0 && (
                <span className="cli-sidebar-count">{totalSolicitacoes}</span>
              )}
            </button>

            <button
              type="button"
              className="cli-sidebar-item"
              onClick={() => navigate('/minha-conta')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7z" />
              </svg>
              <span>Minha Conta</span>
            </button>
          </nav>
        </div>

        <div className="cli-sidebar-bottom">
          <div className="cli-sidebar-user">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="9" r="3" />
              <path d="M6.5 18.5c1.3-2 3.2-3 5.5-3s4.2 1 5.5 3" />
            </svg>

            <div className="cli-sidebar-user-info">
              <strong>{nomeCliente}</strong>
              <small>Cliente</small>
            </div>
          </div>

          <button
            type="button"
            className="cli-sidebar-logout"
            onClick={handleSair}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="cli-main">
        <div className="cli-content-card">
          <header className="cli-mobile-header">
            <h1 className="cli-mobile-brand">AgendaFácil</h1>
          </header>

          {avisoSucesso && (
            <div className="cli-toast" role="status">
              {avisoSucesso}
            </div>
          )}

          <section className="cli-top-bar">
            <p className="cli-greeting">Bom dia, {primeiroNome}</p>

            <div className="cli-search-box">
              <span className="cli-search-icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="10.8" cy="10.8" r="7.2" />
                  <path d="M16.2 16.2L21 21" />
                </svg>
              </span>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Onde você quer agendar?"
                className="cli-search-input"
                aria-label="Buscar estabelecimento"
              />

              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca('')}
                  className="cli-search-clear"
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>
          </section>

          <div className="cli-filters" role="group" aria-label="Categorias">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaAtiva(cat)}
                className={`cli-filter-btn ${categoriaAtiva === cat ? 'is-active' : ''}`}
                aria-pressed={categoriaAtiva === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <section className="cli-business-grid" aria-label="Estabelecimentos">
            {estabelecimentosFiltrados.length > 0 ? (
              estabelecimentosFiltrados.map((estabelecimento) => (
                <button
                  type="button"
                  className="cli-business-card"
                  key={estabelecimento.id}
                  onClick={() => abrirSolicitacao(estabelecimento)}
                >
                  <div className="cli-business-icon">
                    <IconeEstabelecimento tipo={estabelecimento.tipoIcone} />
                  </div>

                  <div className="cli-business-info">
                    <h2 className="cli-business-name">{estabelecimento.nome}</h2>

                    <div className="cli-rating">
                      <span className="cli-star" aria-hidden="true">★</span>
                      <span>{estabelecimento.nota}</span>
                    </div>
                  </div>

                  <div className="cli-business-status">
                    <span
                      className={`cli-status-badge ${
                        estabelecimento.aberto ? 'is-open' : 'is-closed'
                      }`}
                    >
                      {estabelecimento.aberto ? 'Aberto' : 'Fechado'}
                    </span>

                    <p className="cli-business-hours">{estabelecimento.horario}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="cli-empty" style={{ gridColumn: '1 / -1' }}>
                <p>Nenhum estabelecimento encontrado para "{busca}".</p>
                <button
                  type="button"
                  className="cli-btn-secondary"
                  onClick={() => {
                    setBusca('');
                    setCategoriaAtiva('Todos');
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MODAL DE SOLICITAÇÃO DE HORÁRIO */}
      {empresaSelecionada && (
        <div
          className="cli-modal-backdrop"
          onClick={() => setEmpresaSelecionada(null)}
        >
          <div className="cli-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cli-modal-header">
              <div>
                <h2>{empresaSelecionada.nome}</h2>
                <p>{empresaSelecionada.horario}</p>
              </div>

              <button
                type="button"
                className="cli-modal-close"
                onClick={() => setEmpresaSelecionada(null)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarSolicitacaoHorario}>
              <div className="cli-modal-group">
                <span className="cli-modal-label">Escolha o serviço</span>
                <div className="cli-service-options">
                  {servicosModal.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      className={`cli-service-option ${
                        servicoEscolhido?.id === srv.id ? 'is-selected' : ''
                      }`}
                      onClick={() => setServicoEscolhido(srv)}
                    >
                      <span>{srv.nome}</span>
                      <span>
                        {srv.preco} · {srv.duracao}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="cli-modal-group">
                <label htmlFor="cli-data" className="cli-modal-label">
                  Data desejada
                </label>
                <input
                  id="cli-data"
                  type="date"
                  value={dataEscolhida}
                  onChange={(e) => setDataEscolhida(e.target.value)}
                  className="cli-search-box"
                  style={{ height: '42px', paddingInline: '0.75rem' }}
                  required
                />
              </div>

              <div className="cli-modal-group">
                <span className="cli-modal-label">Horário desejado</span>
                <div className="cli-slots-grid">
                  {HORARIOS_DISPONIVEIS.map((hora) => (
                    <button
                      key={hora}
                      type="button"
                      className={`cli-slot-btn ${
                        horarioEscolhido === hora ? 'is-selected' : ''
                      }`}
                      onClick={() => setHorarioEscolhido(hora)}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <p className="cli-modal-hint">
                Seu pedido será enviado ao estabelecimento para confirmação do horário.
              </p>

              <button type="submit" className="cli-btn-primary">
                Solicitar Horário
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAV INFERIOR EM PÍLULA (MOBILE) */}
      <nav className="cli-bottom-nav" aria-label="Navegação mobile">
        <button
          type="button"
          className="cli-nav-item is-selected"
          onClick={() => navigate('/clientes')}
          aria-label="Início"
          aria-pressed="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" />
          </svg>
        </button>

        <button
          type="button"
          className="cli-nav-item"
          onClick={() => navigate('/meus-horarios')}
          aria-label="Meus Horários"
        >
          {totalSolicitacoes > 0 && <span className="cli-nav-badge" />}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
            <path d="M12 3a9 9 0 1 1-8.5 12" />
            <path d="M3 3v6h6" />
            <path d="M12 7v5l3 2" />
          </svg>
        </button>

        <button
          type="button"
          className="cli-nav-item"
          onClick={() => navigate('/minha-conta')}
          aria-label="Minha Conta"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="7" r="4" />
            <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7z" />
          </svg>
        </button>
      </nav>
    </div>
  );
}