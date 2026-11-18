const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiFetch(endpoint, options = {}) {
  const { body, headers, ...rest } = options;

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include', // Obrigatório para receber e reenviar o cookie HTTP-only "token"
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...rest,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detalheDto = Array.isArray(data?.errors)
      ? data.errors[0]?.message || data.errors[0]
      : null;

    const mensagem =
      detalheDto ||
      data?.message ||
      'Não foi possível concluir a solicitação.';

    const erro = new Error(mensagem);
    erro.status = response.status;
    erro.errors = data?.errors || null;
    throw erro;
  }

  return data;
}