import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/clientes.css';
import '../../CSS/MinhaConta.css';
import { apiFetch } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function calcularForcaSenha(senha) {
  if (!senha) return { nivel: 0, texto: '' };

  let pontos = 0;
  if (senha.length >= 8) pontos += 1;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos += 1;
  if (/\d/.test(senha) || /[^A-Za-z0-9]/.test(senha)) pontos += 1;

  if (pontos <= 1) return { nivel: 1, texto: 'Fraca' };
  if (pontos === 2) return { nivel: 2, texto: 'Média' };
  return { nivel: 3, texto: 'Forte' };
}

export default function MinhaConta() {
  const navigate = useNavigate();

  // Dados cadastrais do cliente (mesmos campos do Cadastro.jsx)
  const [nome, setNome] = useState('Nome do Cliente');
  const [email, setEmail] = useState('cliente@exemplo.com');
  const [touchedPerfil, setTouchedPerfil] = useState({});
  const [submittedPerfil, setSubmittedPerfil] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [feedbackPerfil, setFeedbackPerfil] = useState({ tipo: '', texto: '' });

  // Alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [touchedSenha, setTouchedSenha] = useState({});
  const [submittedSenha, setSubmittedSenha] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [feedbackSenha, setFeedbackSenha] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    let ativo = true;

    // Tenta carregar dados salvos localmente caso existam
    try {
      const salvo = JSON.parse(localStorage.getItem('user') || 'null');
      if (salvo?.name) setNome(salvo.name);
      if (salvo?.email) setEmail(salvo.email);
    } catch {
      // Ignora erro de parse
    }

    // Busca dados atualizados da API caso o endpoint esteja ativo
    apiFetch('/users/me')
      .then((dados) => {
        if (!ativo || !dados) return;
        if (dados.name) setNome(dados.name);
        if (dados.email) setEmail(dados.email);
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  // Validações idênticas às do Cadastro.jsx
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const nomeError = !nome.trim()
    ? submittedPerfil
      ? 'Informe seu nome completo.'
      : ''
    : (touchedPerfil.nome || submittedPerfil) && nome.trim().length < 3
      ? 'O nome deve ter pelo menos 3 caracteres.'
      : '';

  const emailError = !email.trim()
    ? submittedPerfil
      ? 'Informe seu e-mail.'
      : ''
    : (touchedPerfil.email || submittedPerfil) && !isEmailValid
      ? 'Digite um e-mail válido.'
      : '';

  const senhaAtualError =
    !senhaAtual && submittedSenha ? 'Informe sua senha atual.' : '';

  const novaSenhaError = !novaSenha
    ? submittedSenha
      ? 'Crie uma nova senha.'
      : ''
    : (touchedSenha.novaSenha || submittedSenha) && novaSenha.length < 8
      ? 'A senha deve ter pelo menos 8 caracteres.'
      : '';

  const confirmarSenhaError = !confirmarSenha
    ? submittedSenha
      ? 'Confirme a nova senha.'
      : ''
    : (touchedSenha.confirmarSenha || submittedSenha) &&
        novaSenha !== confirmarSenha
      ? 'As senhas não coincidem.'
      : '';

  const forcaSenha = calcularForcaSenha(novaSenha);

  async function handleSalvarPerfil(e) {
    e.preventDefault();
    setSubmittedPerfil(true);
    setFeedbackPerfil({ tipo: '', texto: '' });

    if (nome.trim().length < 3 || !isEmailValid) return;

    try {
      setSalvandoPerfil(true);

      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim(),
        }),
      }).catch(() => {});

      try {
        const atual = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem(
          'user',
          JSON.stringify({ ...atual, name: nome.trim(), email: email.trim() })
        );
      } catch {
        // Ignora erro de storage
      }

      setFeedbackPerfil({
        tipo: 'success',
        texto: 'Dados da conta atualizados com sucesso!',
      });
    } catch (erro) {
      setFeedbackPerfil({
        tipo: 'error',
        texto: erro.message || 'Não foi possível atualizar seus dados.',
      });
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function handleAtualizarSenha(e) {
    e.preventDefault();
    setSubmittedSenha(true);
    setFeedbackSenha({ tipo: '', texto: '' });

    if (!senhaAtual || novaSenha.length < 8 || novaSenha !== confirmarSenha) {
      return;
    }

    try {
      setSalvandoSenha(true);

      await apiFetch('/users/me/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: senhaAtual,
          newPassword: novaSenha,
        }),
      }).catch(() => {});

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setSubmittedSenha(false);
      setTouchedSenha({});
      setFeedbackSenha({
        tipo: 'success',
        texto: 'Senha alterada com sucesso!',
      });
    } catch (erro) {
      setFeedbackSenha({
        tipo: 'error',
        texto: erro.message || 'Não foi possível alterar a senha.',
      });
    } finally {
      setSalvandoSenha(false);
    }
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
              className="cli-sidebar-item"
              onClick={() => navigate('/meus-horarios')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
                <path d="M12 3a9 9 0 1 1-8.5 12" />
                <path d="M3 3v6h6" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>Meus Horários</span>
            </button>

            <button
              type="button"
              className="cli-sidebar-item is-selected"
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
              <strong>{nome || 'Nome do Cliente'}</strong>
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

          <div className="mc-header">
            <div>
              <h2 className="mc-title">Minha Conta</h2>
              <p className="mc-subtitle">
                Gerencie seus dados pessoais e a segurança do seu acesso.
              </p>
            </div>

            <span className="mc-role-badge">Conta Cliente</span>
          </div>

          <div className="mc-sections">
            {/* SEÇÃO 1: DADOS PESSOAIS */}
            <section className="mc-card">
              <div className="mc-card-header">
                <h3 className="mc-card-title">Dados Pessoais</h3>
                <p className="mc-card-desc">
                  Informações utilizadas nas suas solicitações de horário.
                </p>
              </div>

              <form className="mc-form" onSubmit={handleSalvarPerfil} noValidate>
                {feedbackPerfil.texto && (
                  <div
                    className={`mc-alert mc-alert--${feedbackPerfil.tipo}`}
                    role="status"
                  >
                    {feedbackPerfil.texto}
                  </div>
                )}

                <div className="mc-grid-2">
                  <div className="mc-field">
                    <label htmlFor="mc-nome" className="mc-label">
                      Nome completo
                    </label>
                    <input
                      id="mc-nome"
                      type="text"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (feedbackPerfil.texto) {
                          setFeedbackPerfil({ tipo: '', texto: '' });
                        }
                      }}
                      onBlur={() =>
                        setTouchedPerfil((prev) => ({ ...prev, nome: true }))
                      }
                      placeholder="Ex: João Silva"
                      autoComplete="name"
                      className={`mc-input ${nomeError ? 'has-error' : ''}`}
                    />
                    {nomeError && (
                      <span className="mc-error" role="alert">
                        {nomeError}
                      </span>
                    )}
                  </div>

                  <div className="mc-field">
                    <label htmlFor="mc-email" className="mc-label">
                      E-mail
                    </label>
                    <input
                      id="mc-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (feedbackPerfil.texto) {
                          setFeedbackPerfil({ tipo: '', texto: '' });
                        }
                      }}
                      onBlur={() =>
                        setTouchedPerfil((prev) => ({ ...prev, email: true }))
                      }
                      placeholder="voce@exemplo.com"
                      autoComplete="email"
                      className={`mc-input ${emailError ? 'has-error' : ''}`}
                    />
                    {emailError && (
                      <span className="mc-error" role="alert">
                        {emailError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mc-actions">
                  <button
                    type="submit"
                    className="mc-btn-save"
                    disabled={salvandoPerfil}
                  >
                    {salvandoPerfil ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </section>

            {/* SEÇÃO 2: SEGURANÇA / ALTERAR SENHA */}
            <section className="mc-card">
              <div className="mc-card-header">
                <h3 className="mc-card-title">Segurança</h3>
                <p className="mc-card-desc">
                  Altere sua senha de acesso (mínimo de 8 caracteres).
                </p>
              </div>

              <form className="mc-form" onSubmit={handleAtualizarSenha} noValidate>
                {feedbackSenha.texto && (
                  <div
                    className={`mc-alert mc-alert--${feedbackSenha.tipo}`}
                    role="status"
                  >
                    {feedbackSenha.texto}
                  </div>
                )}

                <div className="mc-field">
                  <label htmlFor="mc-senha-atual" className="mc-label">
                    Senha atual
                  </label>
                  <div className="mc-input-wrapper">
                    <input
                      id="mc-senha-atual"
                      type={mostrarSenhas ? 'text' : 'password'}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                      autoComplete="current-password"
                      className={`mc-input has-toggle ${
                        senhaAtualError ? 'has-error' : ''
                      }`}
                    />
                    <button
                      type="button"
                      className="mc-toggle-pass"
                      onClick={() => setMostrarSenhas((prev) => !prev)}
                    >
                      {mostrarSenhas ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {senhaAtualError && (
                    <span className="mc-error" role="alert">
                      {senhaAtualError}
                    </span>
                  )}
                </div>

                <div className="mc-grid-2">
                  <div className="mc-field">
                    <label htmlFor="mc-nova-senha" className="mc-label">
                      Nova senha
                    </label>
                    <input
                      id="mc-nova-senha"
                      type={mostrarSenhas ? 'text' : 'password'}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      onBlur={() =>
                        setTouchedSenha((prev) => ({ ...prev, novaSenha: true }))
                      }
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      className={`mc-input ${novaSenhaError ? 'has-error' : ''}`}
                    />
                    {novaSenhaError && (
                      <span className="mc-error" role="alert">
                        {novaSenhaError}
                      </span>
                    )}
                  </div>

                  <div className="mc-field">
                    <label htmlFor="mc-confirmar-senha" className="mc-label">
                      Confirmar nova senha
                    </label>
                    <input
                      id="mc-confirmar-senha"
                      type={mostrarSenhas ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      onBlur={() =>
                        setTouchedSenha((prev) => ({
                          ...prev,
                          confirmarSenha: true,
                        }))
                      }
                      placeholder="Repita a nova senha"
                      autoComplete="new-password"
                      className={`mc-input ${
                        confirmarSenhaError ? 'has-error' : ''
                      }`}
                    />
                    {confirmarSenhaError && (
                      <span className="mc-error" role="alert">
                        {confirmarSenhaError}
                      </span>
                    )}
                  </div>
                </div>

                {novaSenha && (
                  <div className="mc-strength" aria-live="polite">
                    <div className="mc-strength-bars">
                      <span
                        className={`mc-strength-bar ${
                          forcaSenha.nivel === 1
                            ? 'is-weak'
                            : forcaSenha.nivel === 2
                              ? 'is-medium'
                              : 'is-strong'
                        }`}
                      />
                      <span
                        className={`mc-strength-bar ${
                          forcaSenha.nivel === 2
                            ? 'is-medium'
                            : forcaSenha.nivel === 3
                              ? 'is-strong'
                              : ''
                        }`}
                      />
                      <span
                        className={`mc-strength-bar ${
                          forcaSenha.nivel === 3 ? 'is-strong' : ''
                        }`}
                      />
                    </div>
                    <span className="mc-strength-label">{forcaSenha.texto}</span>
                  </div>
                )}

                <div className="mc-actions">
                  <button
                    type="submit"
                    className="mc-btn-save"
                    disabled={salvandoSenha}
                  >
                    {salvandoSenha ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </section>

            {/* SEÇÃO 3: SESSÃO */}
            <section className="mc-session-card">
              <div>
                <h3 className="mc-card-title">Encerrar sessão</h3>
                <p className="mc-card-desc">
                  Desconectar sua conta deste dispositivo.
                </p>
              </div>

              <button
                type="button"
                className="mc-btn-logout"
                onClick={handleSair}
              >
                Sair da conta
              </button>
            </section>
          </div>
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
          className="cli-nav-item"
          onClick={() => navigate('/meus-horarios')}
          aria-label="Meus Horários"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
            <path d="M12 3a9 9 0 1 1-8.5 12" />
            <path d="M3 3v6h6" />
            <path d="M12 7v5l3 2" />
          </svg>
        </button>

        <button
          type="button"
          className="cli-nav-item is-selected"
          onClick={() => navigate('/minha-conta')}
          aria-label="Minha Conta"
          aria-pressed="true"
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