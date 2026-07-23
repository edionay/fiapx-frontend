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

export async function postJson<T>(caminho: string, corpo: unknown): Promise<T> {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })

  if (!resposta.ok) {
    const dados = (await resposta.json().catch(() => null)) as { erro?: string } | null
    throw new ErroApi(dados?.erro ?? `Erro ${resposta.status}`, resposta.status)
  }

  return (await resposta.json()) as T
}
