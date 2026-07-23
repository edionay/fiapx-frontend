import { describe, it, expect, vi, afterEach } from 'vitest'
import { cadastrar, entrar } from '../autenticacao'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('cadastrar', () => {
  it('envia e-mail e senha e retorna o usuário', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '1', email: 'a@b.com' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const usuario = await cadastrar({ email: 'a@b.com', senha: 'senhaforte1' })

    expect(usuario).toEqual({ id: '1', email: 'a@b.com' })
    const [url, opcoes] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/auth/cadastro')
    expect(opcoes.method).toBe('POST')
    expect(JSON.parse(opcoes.body as string)).toEqual({
      email: 'a@b.com',
      senha: 'senhaforte1',
    })
  })

  it('lança ErroApi com a mensagem do servidor', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ erro: 'E-mail já cadastrado' }),
      }),
    )

    await expect(cadastrar({ email: 'a@b.com', senha: 'senhaforte1' })).rejects.toThrow(
      'E-mail já cadastrado',
    )
  })
})

describe('entrar', () => {
  it('envia as credenciais e retorna o token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'jwt-123' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const sessao = await entrar({ email: 'a@b.com', senha: 'senhaforte1' })

    expect(sessao).toEqual({ token: 'jwt-123' })
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/auth/login')
  })

  it('lança ErroApi quando as credenciais são inválidas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ erro: 'Credenciais inválidas' }),
      }),
    )

    await expect(entrar({ email: 'a@b.com', senha: 'errada' })).rejects.toThrow(
      'Credenciais inválidas',
    )
  })
})
