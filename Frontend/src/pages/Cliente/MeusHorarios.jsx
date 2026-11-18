import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/clientes.css';
import '../../CSS/MeusHorarios.css';
import { apiFetch } from '../../services/api';

const FILTROS = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'PENDING', label: 'Aguardando' },
  { id: 'CONFIRMED', label: 'Confirmados' },
  { id: 'CANCELLED', label: 'Cancelados' },
];

const SOLICITACOES_EXEMPLO = [
  {
    id: 'demo-req-1',
    isRealApi: false,
    empresa: 'Barbearia Estilo Fino',
    servico: 'Corte + Barba',
    preco: 'R$ 70,00',
    data: '2026-11-20',
    horario: '14:00',
    status: 'PENDING',
  },
  {
    id: 'demo-req-2',
    isRealApi: false,
    empresa: 'Clínica Vida Plena',
    servico: 'Consulta Geral',
    preco: 'R$ 150,00',
    data: '2026-11-22',
    horario: '09:00',
    status: 'CONFIRMED',
  },
];

function lerSolicitacoesLocais() {
  try {
    const dados = JSON.parse(
      localStorage.getItem('af_solicitacoes_cliente') || '[]'
    );
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function formatarDataBR(isoDate) {
  if (!isoDate || !isoDate.includes('-')) return isoDate || 'Data a definir';
  const [ano, mes, dia] = isoDate.split('-');
  return `${dia}/${mes}/${ano}`;
}

function obterInfoStatus(status) {
  if (status === 'CONFIRMED') {
    return {
      texto: 'Confirmado pela empresa',
      classe: 'mh-badge--confirmed',
      grupo: 'CONFIRMED',
    };
  }
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return {
      texto: status === 'REJECTED' ? 'Recusado pela empresa' : 'Cancelado',
      classe: 'mh-badge--cancelled',
      grupo: 'CANCELLED',
    };
  }
  return {
    texto: 'Aguardando aprovação',
    classe: 'mh-badge--pending',
    grupo: 'PENDING',
  };
}

export default function MeusHorarios() {
  const navigate = useNavigate();

  // Renderiza imediatamente do localStorage sem esperar a API
  const [solicitacoes, setSolicitacoes] = useState(() => {
    const locais = lerSolicitacoesLocais();
    if (locais.length > 0) return locais;
    return localStorage.getItem('token') ? [] : SOLICITACOES_EXEMPLO;
  });

  const [carregando, setCarregando] = useState(() =>
    Boolean(localStorage.getItem('token'))
  );
  const [filtroAtivo, setFiltroAtivo] = useState('TODOS');
  const [cancelandoId, setCancelandoId] = useState(null);
  const [aviso, setAviso] = useState('');

  const nomeCliente = useMemo(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      return salvo?.name || 'Nome do Cliente';
    } catch {
      return 'Nome do Cliente';
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCarregando(false);
      return;
    }

    let ativo = true;
    const controller = new AbortController();
    const locais = lerSolicitacoesLocais();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(new Error('timeout'));
      }, 4000)
    );

    Promise.race([
      apiFetch('/booking/appointments', { signal: controller.signal }),
      timeoutPromise,
    ])
      .then((lista) => {
        if (!ativo) return;

        if (Array.isArray(lista) && lista.length > 0) {
          const formatadas = lista.map((ag) => ({
            id: ag.id,
            isRealApi: true,
            empresa: ag.companyNameAtBooking || 'Estabelecimento',
            servico: ag.serviceNameAtBooking || 'Serviço',
            preco:
              ag.priceAtBooking != null
                ? `R$ ${Number(ag.priceAtBooking).toFixed(2).replace('.', ',')}`
                : '',
            data: ag.startAt ? ag.startAt.slice(0, 10) : '',
            horario: ag.startAt ? ag.startAt.slice(11, 16) : '',
            status: ag.status || 'PENDING',
          }));
          setSolicitacoes([...locais, ...formatadas]);
        } else {
          setSolicitacoes(locais.length > 0 ? locais : SOLICITACOES_EXEMPLO);
        }
      })
      .catch(() => {
        if (!ativo) return;
        setSolicitacoes(locais.length > 0 ? locais : SOLICITACOES_EXEMPLO);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
      controller.abort();
    };
  }, []);

  const contadores = useMemo(() => {
    return solicitacoes.reduce(
      (acc, item) => {
        const { grupo } = obterInfoStatus(item.status);
        acc.TODOS += 1;
        acc[grupo] = (acc[grupo] || 0) + 1;
        return acc;
      },
      { TODOS: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0 }
    );
  }, [solicitacoes]);

  const listaFiltrada = useMemo(() => {
    if (filtroAtivo === 'TODOS') return solicitacoes;
    return solicitacoes.filter(
      (item) => obterInfoStatus(item.status).grupo === filtroAtivo
    );
  }, [solicitacoes, filtroAtivo]);

  async function handleCancelar(item) {
    setCancelandoId(item.id);

    if (item.isRealApi) {
      try {
        await apiFetch(`/booking/appointments/${item.id}/cancel`, {
          method: 'POST',
        });
      } catch {
        // Mantém atualização visual em modo demo
      }
    }

    setSolicitacoes((prev) => {
      const atualizada = prev.map((ag) =>
        ag.id === item.id ? { ...ag, status: 'CANCELLED' } : ag
      );

      try {
        const apenasLocais = atualizada.filter((ag) => !ag.isRealApi);
        localStorage.setItem(
          'af_solicitacoes_cliente',
          JSON.stringify(apenasLocais)
        );
      } catch {
        // Ignora erro de storage
      }

      return atualizada;
    });

    setCancelandoId(null);
    setAviso(`Solicitação em ${item.empresa} cancelada.`);
    setTimeout(() => setAviso(''), 4000);
  }

  function handleSair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="cli-layout">
      {/* SIDEBAR PARA VISUALIZAÇÃO PC */}
      <aside className="cli-sidebar">
        <div className="cli-sidebar-top">
          <h1 className="cli-sidebar-logo">AgendaFácil</h1>

          <nav className="cli-sidebar-nav" aria-label="Navegação principal">
            <button
              type="button"
              className="cli-sidebar-item"
              onClick={() => navigate('/clientes')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" />
              </svg>
              <span>Início</span>
            </button>

            <button
              type="button"
              className="cli-sidebar-item is-selected"
              onClick={() => navigate('/meus-horarios')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3a9 9 0 1 1-8.5 12" />
                <path d="M3 3v6h6" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Meus Horários</span>
              {contadores.PENDING > 0 && (
                <span className="cli-sidebar-count">{contadores.PENDING}</span>
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

          <div className="mh-header">
            <div>
              <h2 className="mh-title">Meus Horários</h2>
              <p className="mh-subtitle">
                Acompanhe o status das solicitações enviadas aos estabelecimentos.
              </p>
            </div>

            <button
              type="button"
              className="mh-btn-new"
              onClick={() => navigate('/clientes')}
            >
              <span>+ Solicitar Novo Horário</span>
            </button>
          </div>

          {aviso && (
            <div className="cli-toast" role="status">
              {aviso}
            </div>
          )}

          {/* FILTROS POR STATUS */}
          <div className="mh-filters" role="group" aria-label="Filtrar por status">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`mh-filter-btn ${filtroAtivo === f.id ? 'is-active' : ''}`}
                onClick={() => setFiltroAtivo(f.id)}
                aria-pressed={filtroAtivo === f.id}
              >
                <span>{f.label}</span>
                <span className="mh-filter-count">{contadores[f.id] || 0}</span>
              </button>
            ))}
          </div>

          {/* LISTA DE SOLICITAÇÕES */}
          {carregando && listaFiltrada.length === 0 ? (
            <div className="cli-empty">
              <p>Carregando suas solicitações...</p>
            </div>
          ) : listaFiltrada.length > 0 ? (
            <div className="mh-list">
              {listaFiltrada.map((item) => {
                const statusInfo = obterInfoStatus(item.status);
                const podeCancelar = statusInfo.grupo !== 'CANCELLED';

                return (
                  <article key={item.id} className="mh-card">
                    <div className="mh-card-left">
                      <div className="mh-card-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>

                      <div className="mh-card-info">
                        <h3 className="mh-card-company">{item.empresa}</h3>
                        <p className="mh-card-service">
                          {item.servico}
                          {item.preco ? ` · ${item.preco}` : ''}
                        </p>

                        <div className="mh-card-datetime">
                          <span>📅 {formatarDataBR(item.data)}</span>
                          <span>🕒 {item.horario}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mh-card-right">
                      <span className={`mh-badge ${statusInfo.classe}`}>
                        {statusInfo.texto}
                      </span>

                      {podeCancelar && (
                        <button
                          type="button"
                          className="mh-btn-cancel"
                          disabled={cancelandoId === item.id}
                          onClick={() => handleCancelar(item)}
                        >
                          {cancelandoId === item.id
                            ? 'Cancelando...'
                            : 'Cancelar pedido'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="cli-empty">
              <p>Nenhum horário encontrado neste filtro.</p>
              <button
                type="button"
                className="cli-btn-secondary"
                onClick={() =>
                  filtroAtivo === 'TODOS'
                    ? navigate('/clientes')
                    : setFiltroAtivo('TODOS')
                }
              >
                {filtroAtivo === 'TODOS'
                  ? 'Explorar estabelecimentos'
                  : 'Ver todas as solicitações'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* NAV INFERIOR EM PÍLULA (MOBILE) */}
      <nav className="cli-bottom-nav" aria-label="Navegação mobile">
        <button
          type="button"
          className="cli-nav-item"
          onClick={() => navigate('/clientes')}
          aria-label="Início"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-7h-6v7H3z" />
          </svg>
        </button>

        <button
          type="button"
          className="cli-nav-item is-selected"
          onClick={() => navigate('/meus-horarios')}
          aria-label="Meus Horários"
          aria-pressed="true"
        >
          {contadores.PENDING > 0 && <span className="cli-nav-badge" />}
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