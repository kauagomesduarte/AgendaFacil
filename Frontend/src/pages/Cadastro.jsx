import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import {
  AccountTypeSwitch,
  AuthInput,
  AuthSelect,
  PasswordStrengthMeter,
} from '../components/AuthField';
import Botao from '../components/Botao';
import { cadastrarUsuario } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos.length ? `(${digitos}` : '';
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export default function Cadastro() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [cidades, setCidades] = useState([]);
  const [carregandoCidades, setCarregandoCidades] = useState(true);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [tipoEstabelecimento, setTipoEstabelecimento] = useState('');
  const [cidade, setCidade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (Array.isArray(dados)) {
          setCidades(dados);
        }
      })
      .catch((erro) => console.error('Erro ao carregar cidades:', erro))
      .finally(() => setCarregandoCidades(false));
  }, []);

  const isEmpresa = tipoUsuario === 'empresa';
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const telefoneDigitos = telefone.replace(/\D/g, '');

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

  const nomeError = !nome.trim() && submitted
    ? isEmpresa
      ? 'Informe o nome da empresa.'
      : 'Informe seu nome completo.'
    : '';

  const emailError = !email.trim()
    ? submitted
      ? 'Informe seu e-mail.'
      : ''
    : (touched.email || submitted) && !isEmailValid
      ? 'Digite um e-mail válido.'
      : '';

  const telefoneError = !isEmpresa
    ? telefoneDigitos.length === 0
      ? submitted
        ? 'Informe seu número de contato.'
        : ''
      : (touched.telefone || submitted) && telefoneDigitos.length < 10
        ? 'Digite um telefone com DDD.'
        : ''
    : '';

  const estabelecimentoError =
    isEmpresa && !tipoEstabelecimento && submitted
      ? 'Selecione o tipo de estabelecimento.'
      : '';

  const cidadeError = !cidade && submitted ? 'Selecione sua cidade.' : '';

  const senhaError = !senha
    ? submitted
      ? 'Crie uma senha.'
      : ''
    : (touched.senha || submitted) && senha.length < 6
      ? 'Use pelo menos 6 caracteres.'
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
      emailError ||
      telefoneError ||
      estabelecimentoError ||
      cidadeError ||
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
      !nome.trim() ||
      !email.trim() ||
      !isEmailValid ||
      (!isEmpresa && telefoneDigitos.length < 10) ||
      (isEmpresa && !tipoEstabelecimento) ||
      !cidade ||
      !senha ||
      senha.length < 6 ||
      !confirmarSenha ||
      senha !== confirmarSenha ||
      !aceitouTermos;

    if (isInvalid) {
      setShakeCount((prev) => prev + 1);
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuario({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });

      navigate('/login', { state: { cadastroSucesso: true } });
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
          ? 'Cadastre seu estabelecimento para gerenciar horários e clientes.'
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
              label={isEmpresa ? 'Nome da Empresa' : 'Nome completo'}
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (erroApi) setErroApi('');
              }}
              onBlur={() => markTouched('nome')}
              placeholder={isEmpresa ? 'Ex: Barbearia Central' : 'Ex: João Silva'}
              autoComplete={isEmpresa ? 'organization' : 'name'}
              error={nomeError}
            />

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

            <div className="af-auth-grid-2">
              {isEmpresa ? (
                <AuthSelect
                  label="Tipo de Estabelecimento"
                  value={tipoEstabelecimento}
                  onChange={(e) => setTipoEstabelecimento(e.target.value)}
                  onBlur={() => markTouched('tipoEstabelecimento')}
                  placeholder="Selecione"
                  error={estabelecimentoError}
                >
                  <option value="barbearia">Barbearia</option>
                  <option value="clinica">Clínica</option>
                </AuthSelect>
              ) : (
                <AuthInput
                  label="Número de contato"
                  type="tel"
                  inputMode="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  onBlur={() => markTouched('telefone')}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                  maxLength={15}
                  error={telefoneError}
                />
              )}

              <AuthSelect
                label="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                onBlur={() => markTouched('cidade')}
                placeholder={
                  carregandoCidades && cidades.length === 0
                    ? 'Carregando...'
                    : 'Selecione'
                }
                disabled={carregandoCidades && cidades.length === 0}
                error={cidadeError}
              >
                {cidades.map((item) => (
                  <option key={item.id} value={item.nome}>
                    {item.nome} - {item?.microrregiao?.mesorregiao?.UF?.sigla || 'BR'}
                  </option>
                ))}
              </AuthSelect>
            </div>
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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                error={senhaError}
              />

              <AuthInput
                label="Confirmar senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
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