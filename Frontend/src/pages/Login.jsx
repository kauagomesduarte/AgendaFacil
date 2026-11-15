import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { AuthInput } from '../components/AuthField';
import Botao from '../components/Botao';
import { loginUsuario } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [cadastroSucesso] = useState(Boolean(location.state?.cadastroSucesso));

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const emailError = !email.trim()
    ? submitted
      ? 'Informe seu e-mail.'
      : ''
    : (touched.email || submitted) && !isEmailValid
      ? 'Digite um e-mail válido.'
      : '';

  const senhaError = !senha && submitted ? 'Informe sua senha.' : '';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setErroApi('');

    if (!email.trim() || !isEmailValid || !senha) {
      setShakeCount((prev) => prev + 1);
      return;
    }

    try {
      setCarregando(true);
      await loginUsuario({
        email: email.trim(),
        password: senha,
      });
      navigate('/meus-horarios');
    } catch (erro) {
      setErroApi(erro.message);
      setShakeCount((prev) => prev + 1);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout
      headerActionLabel="Criar conta"
      headerActionTo="/cadastro"
      title="Entrar"
      subtitle="Acesse sua conta para acompanhar seus horários."
      shake={shakeCount > 0 && Boolean(emailError || senhaError || erroApi)}
    >
      <form className="af-auth-form" onSubmit={handleSubmit} noValidate>
        {cadastroSucesso && !erroApi && (
          <p className="af-auth-alert af-auth-alert--success" role="status">
            Conta criada com sucesso. Faça login para continuar.
          </p>
        )}

        {erroApi && (
          <p className="af-auth-alert af-auth-alert--error" role="alert">
            {erroApi}
          </p>
        )}

        <fieldset className="af-auth-fieldset" disabled={carregando}>
          <AuthInput
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erroApi) setErroApi('');
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            error={emailError}
          />

          <AuthInput
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (erroApi) setErroApi('');
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, senha: true }))}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            error={senhaError}
          />

          <div className="af-auth-submit">
            <Botao texto={carregando ? 'Entrando...' : 'Entrar'} />
          </div>
        </fieldset>
      </form>

      <div className="af-auth-links">
        <p className="af-auth-switch">
          <a
            href="#recuperar-senha"
            onClick={(e) => {
              e.preventDefault();
              setShowRecoveryNotice((prev) => !prev);
            }}
            aria-expanded={showRecoveryNotice}
          >
            Esqueci minha senha
          </a>
        </p>

        <div
          className={`af-collapse ${showRecoveryNotice ? 'af-collapse--open' : ''}`}
          aria-hidden={!showRecoveryNotice}
        >
          <div className="af-collapse__inner">
            <p className="af-auth-notice" role="status">
              Para recuperar o acesso à sua conta, entre em contato com o suporte ou com o administrador do seu estabelecimento.
            </p>
          </div>
        </div>

        <p className="af-auth-switch">
          Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </AuthLayout>
  );
}