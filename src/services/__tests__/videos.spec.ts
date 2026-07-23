import { describe, it, expect, vi, afterEach } from 'vitest'
import { enviarVideo } from '../videos'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('enviarVideo', () => {
  it('envia o arquivo com o token e retorna o vídeo criado', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ videoId: 'v1', status: 'PENDENTE' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const arquivo = new File(['conteudo'], 'filme.mp4', { type: 'video/mp4' })
    const resultado = await enviarVideo(arquivo, 'jwt-123')

    expect(resultado).toEqual({ videoId: 'v1', status: 'PENDENTE' })
    const [url, opcoes] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/videos')
    expect(opcoes.method).toBe('POST')
    expect((opcoes.headers as Record<string, string>).Authorization).toBe('Bearer jwt-123')
    expect(opcoes.body).toBeInstanceOf(FormData)
    expect((opcoes.body as FormData).get('arquivo')).toBeInstanceOf(File)
  })

  it('lança ErroApi quando a API recusa', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ erro: 'Não autorizado' }),
      }),
    )

    const arquivo = new File(['x'], 'a.mp4', { type: 'video/mp4' })
    await expect(enviarVideo(arquivo, 'jwt')).rejects.toThrow('Não autorizado')
  })
})
