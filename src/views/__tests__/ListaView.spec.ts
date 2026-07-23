import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ListaView from '../ListaView.vue'
import { listarVideos, baixarVideo, type Video } from '../../services/videos'
import { useSessao } from '../../composables/useSessao'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  RouterLink: { template: '<a><slot /></a>' },
}))
vi.mock('../../services/videos', () => ({
  listarVideos: vi.fn(),
  baixarVideo: vi.fn(),
}))

const listarMock = vi.mocked(listarVideos)
const baixarMock = vi.mocked(baixarVideo)

function video(parcial: Partial<Video>): Video {
  return {
    id: 'v1',
    nomeOriginal: 'a.mp4',
    status: 'CONCLUIDO',
    mensagemErro: null,
    criadoEm: '2026-07-23T12:00:00.000Z',
    atualizadoEm: '2026-07-23T12:00:00.000Z',
    ...parcial,
  }
}

describe('ListaView', () => {
  beforeEach(() => {
    listarMock.mockReset()
    baixarMock.mockReset()
    useSessao().definir('jwt-123')
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:fake'),
      revokeObjectURL: vi.fn(),
    })
  })

  it('lista os vídeos ao montar', async () => {
    listarMock.mockResolvedValue([
      video({ id: 'v1', nomeOriginal: 'ferias.mp4', status: 'CONCLUIDO' }),
      video({ id: 'v2', nomeOriginal: 'aula.mp4', status: 'PROCESSANDO' }),
    ])
    const wrapper = mount(ListaView)
    await flushPromises()

    expect(listarMock).toHaveBeenCalledWith('jwt-123')
    expect(wrapper.text()).toContain('ferias.mp4')
    expect(wrapper.text()).toContain('PROCESSANDO')
  })

  it('mostra o estado vazio', async () => {
    listarMock.mockResolvedValue([])
    const wrapper = mount(ListaView)
    await flushPromises()
    expect(wrapper.text()).toContain('ainda não enviou')
  })

  it('mostra a mensagem de erro do vídeo que falhou', async () => {
    listarMock.mockResolvedValue([
      video({ status: 'ERRO', mensagemErro: 'ffmpeg: moov atom not found' }),
    ])
    const wrapper = mount(ListaView)
    await flushPromises()
    expect(wrapper.text()).toContain('moov atom not found')
  })

  it('baixa o pacote de um vídeo concluído', async () => {
    listarMock.mockResolvedValue([video({ id: 'v1', status: 'CONCLUIDO' })])
    baixarMock.mockResolvedValue(new Blob(['zip'], { type: 'application/zip' }))
    const wrapper = mount(ListaView)
    await flushPromises()

    await wrapper.find('button.bg-slate-900').trigger('click')
    await flushPromises()

    expect(baixarMock).toHaveBeenCalledWith('v1', 'jwt-123')
  })
})
