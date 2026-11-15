const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagemErro =
      data?.message ||
      data?.error ||
      (response.status === 401
        ? 'E-mail ou senha inválidos.'
        : 'Não foi possível concluir a solicitação.');

    throw new Error(Array.isArray(mensagemErro) ? mensagemErro[0] : mensagemErro);
  }

  return data;
}

export async function loginUsuario({ email, password }) {
  const data = await request('/auth/login', { email, password });

  const token = data?.token || data?.access_token || data?.accessToken;
  if (token) {
    localStorage.setItem('token', token);
  }

  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export async function cadastrarUsuario({ name, email, password }) {
  return request('/users', { name, email, password });
}