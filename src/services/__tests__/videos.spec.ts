import { describe, it, expect, vi, afterEach } from 'vitest'
import { baixarVideo, enviarVideo, listarVideos } from '../videos'

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

describe('listarVideos', () => {
  it('busca os vídeos com o token', async () => {
    const lista = [{ id: 'v1', nomeOriginal: 'a.mp4', status: 'CONCLUIDO' }]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(lista),
    })
    vi.stubGlobal('fetch', fetchMock)

    const resultado = await listarVideos('jwt-123')

    expect(resultado).toEqual(lista)
    const [url, opcoes] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/videos')
    expect((opcoes.headers as Record<string, string>).Authorization).toBe('Bearer jwt-123')
  })
})

describe('baixarVideo', () => {
  it('busca o pacote como blob usando o token', async () => {
    const blob = new Blob(['zip'], { type: 'application/zip' })
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(blob),
    })
    vi.stubGlobal('fetch', fetchMock)

    const resultado = await baixarVideo('v1', 'jwt-123')

    expect(resultado).toBe(blob)
    const [url, opcoes] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/videos/v1/download')
    expect((opcoes.headers as Record<string, string>).Authorization).toBe('Bearer jwt-123')
  })
})
