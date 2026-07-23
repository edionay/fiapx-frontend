const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ErroApi extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ErroApi'
  }
}

async function tratar<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    const dados = (await resposta.json().catch(() => null)) as { erro?: string } | null
    throw new ErroApi(dados?.erro ?? `Erro ${resposta.status}`, resposta.status)
  }

  return (await resposta.json()) as T
}

function autorizacao(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function postJson<T>(caminho: string, corpo: unknown, token?: string): Promise<T> {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...autorizacao(token) },
    body: JSON.stringify(corpo),
  })

  return tratar<T>(resposta)
}

export async function postForm<T>(caminho: string, form: FormData, token?: string): Promise<T> {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: 'POST',
    headers: autorizacao(token),
    body: form,
  })

  return tratar<T>(resposta)
}
