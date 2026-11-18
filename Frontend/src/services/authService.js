import { apiFetch } from './api';

export async function loginUsuario({ email, password }) {
  // POST /auth/login -> 200 {"message": "Logged in successfully."} + cookie HTTP-only "token"
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function cadastrarUsuario({ name, email, password }) {
  // POST /users -> 201 {"message": "Usuário criado"}
  return apiFetch('/users', {
    method: 'POST',
    body: { name, email, password },
  });
}

export async function criarEmpresa({ name, timeZone = 'America/Sao_Paulo' }) {
  // POST /comp -> 201 {"id": 1, "name": "...", "timeZone": "..."} (torna o usuário OWNER)
  const empresa = await apiFetch('/comp', {
    method: 'POST',
    body: { name, timeZone },
  });

  if (empresa?.id) {
    localStorage.setItem('companyId', String(empresa.id));
  }

  return empresa;
}

export async function cadastrarEmpresaCompleto({
  name,
  companyName,
  email,
  password,
  timeZone,
}) {
  await cadastrarUsuario({ name, email, password });
  await loginUsuario({ email, password });
  return criarEmpresa({ name: companyName, timeZone });
}