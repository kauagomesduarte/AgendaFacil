import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import {
  AccountTypeSwitch,
  AuthInput,
  AuthSelect,
  PasswordStrengthMeter,
} from '../components/AuthField';
import Botao from '../components/Botao';
import {
  cadastrarEmpresaCompleto,
  cadastrarUsuario,
} from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FUSOS_BRASIL = [
  { value: 'America/Sao_Paulo', label: 'Brasília / São Paulo (GMT-3)' },
  { value: 'America/Fortaleza', label: 'Nordeste / Fortaleza (GMT-3)' },
  { value: 'America/Manaus', label: 'Amazonas / Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Mato Grosso / Cuiabá (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Acre / Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
];

export default function Cadastro() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [nome, setNome] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [timeZone, setTimeZone] = useState('America/Sao_Paulo');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const isEmpresa = tipoUsuario === 'empresa';
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  function handleTrocarTipo(novoTipo) {
    if (novoTipo === tipoUsuario) return;
    setTipoUsuario(novoTipo);
    setSubmitted(false);
    setTouched({});
    setErroApi('');
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const nomeError = !nome.trim()
    ? submitted
      ? 'Informe seu nome completo.'
      : ''
    : (touched.nome || submitted) && nome.trim().length < 3
      ? 'O nome deve ter pelo menos 3 caracteres.'
      : '';

  const empresaError = isEmpresa
    ? !nomeEmpresa.trim()
      ? submitted
        ? 'Informe o nome da empresa.'
        : ''
      : (touched.nomeEmpresa || submitted) &&
          (nomeEmpresa.trim().length < 3 || nomeEmpresa.trim().length > 150)
        ? 'Entre 3 e 150 caracteres.'
        : ''
    : '';

  const timeZoneError =
    isEmpresa && !timeZone && submitted ? 'Selecione o fuso horário.' : '';

  const emailError = !email.trim()
    ? submitted
      ? 'Informe seu e-mail.'
      : ''
    : (touched.email || submitted) && !isEmailValid
      ? 'Digite um e-mail válido.'
      : '';

  const senhaError = !senha
    ? submitted
      ? 'Crie uma senha.'
      : ''
    : (touched.senha || submitted) && senha.length < 8
      ? 'A senha deve ter pelo menos 8 caracteres.'
      : '';

  const confirmarError = !confirmarSenha
    ? submitted
      ? 'Confirme sua senha.'
      : ''
    : (touched.confirmarSenha || submitted) && senha !== confirmarSenha
      ? 'As senhas não coincidem.'
      : '';

  const termosError =
    !aceitouTermos && submitted
      ? 'Aceite os Termos e a Política de Privacidade.'
      : '';

  const hasAnyVisibleError = Boolean(
    nomeError ||
      empresaError ||
      timeZoneError ||
      emailError ||
      senhaError ||
      confirmarError ||
      termosError ||
      erroApi
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setErroApi('');

    const isInvalid =
      nome.trim().length < 3 ||
      !isEmailValid ||
      (isEmpresa &&
        (nomeEmpresa.trim().length < 3 ||
          nomeEmpresa.trim().length > 150 ||
          !timeZone)) ||
      senha.length < 8 ||
      senha !== confirmarSenha ||
      !aceitouTermos;

    if (isInvalid) {
      setShakeCount((prev) => prev + 1);
      return;
    }

    try {
      setCarregando(true);

      if (isEmpresa) {
        await cadastrarEmpresaCompleto({
          name: nome.trim(),
          companyName: nomeEmpresa.trim(),
          email: email.trim(),
          password: senha,
          timeZone,
        });
        navigate('/servicos');
      } else {
        await cadastrarUsuario({
          name: nome.trim(),
          email: email.trim(),
          password: senha,
        });
        navigate('/login', { state: { cadastroSucesso: true } });
      }
    } catch (erro) {
      setErroApi(erro.message);
      setShakeCount((prev) => prev + 1);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout
      headerActionLabel="Entrar"
      headerActionTo="/login"
      title="Criar conta"
      subtitle={
        isEmpresa
          ? 'Crie sua conta e configure sua empresa em um só passo.'
          : 'Crie sua conta para agendar horários com rapidez.'
      }
      wide
      shake={shakeCount > 0 && hasAnyVisibleError}
    >
      <form className="af-auth-form" onSubmit={handleSubmit} noValidate>
        {erroApi && (
          <p className="af-auth-alert af-auth-alert--error" role="alert">
            {erroApi}
          </p>
        )}

        <fieldset className="af-auth-fieldset" disabled={carregando}>
          <AccountTypeSwitch value={tipoUsuario} onChange={handleTrocarTipo} />

          <div key={tipoUsuario} className="af-auth-dynamic-group">
            <AuthInput
              label={isEmpresa ? 'Seu nome (responsável)' : 'Nome completo'}
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (erroApi) setErroApi('');
              }}
              onBlur={() => markTouched('nome')}
              placeholder="Ex: João Silva"
              autoComplete="name"
              error={nomeError}
            />

            {isEmpresa && (
              <div className="af-auth-grid-2">
                <AuthInput
                  label="Nome da Empresa"
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => {
                    setNomeEmpresa(e.target.value);
                    if (erroApi) setErroApi('');
                  }}
                  onBlur={() => markTouched('nomeEmpresa')}
                  placeholder="Ex: Barbearia Central"
                  autoComplete="organization"
                  error={empresaError}
                />

                <AuthSelect
                  label="Fuso horário"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  onBlur={() => markTouched('timeZone')}
                  placeholder="Selecione"
                  error={timeZoneError}
                >
                  {FUSOS_BRASIL.map((fuso) => (
                    <option key={fuso.value} value={fuso.value}>
                      {fuso.label}
                    </option>
                  ))}
                </AuthSelect>
              </div>
            )}

            <AuthInput
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erroApi) setErroApi('');
              }}
              onBlur={() => markTouched('email')}
              placeholder={isEmpresa ? 'contato@empresa.com' : 'voce@exemplo.com'}
              autoComplete="email"
              error={emailError}
            />
          </div>

          <div>
            <div className="af-auth-grid-2">
              <AuthInput
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (erroApi) setErroApi('');
                }}
                onBlur={() => markTouched('senha')}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                error={senhaError}
              />

              <AuthInput
                label="Confirmar senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  if (erroApi) setErroApi('');
                }}
                onBlur={() => markTouched('confirmarSenha')}
                placeholder="Repita a senha"
                autoComplete="new-password"
                error={confirmarError}
              />
            </div>

            <PasswordStrengthMeter password={senha} />
          </div>

          <div>
            <div className="af-auth-check">
              <input
                type="checkbox"
                id="termos"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                aria-invalid={Boolean(termosError)}
                className="af-auth-check__input"
              />
              <label htmlFor="termos" className="af-auth-check__label">
                Li e aceito os Termos e a Política de Privacidade
              </label>
            </div>
            {termosError && (
              <span className="af-field__error" role="alert">
                {termosError}
              </span>
            )}
          </div>

          <div className="af-auth-submit">
            <Botao texto={carregando ? 'Cadastrando...' : 'Cadastrar'} />
          </div>
        </fieldset>
      </form>

      <p className="af-auth-switch">
        Já possui uma conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}