import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import UploadView from '../UploadView.vue'
import { enviarVideo } from '../../services/videos'
import { ErroApi } from '../../services/http'
import { useSessao } from '../../composables/useSessao'

vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../services/videos', () => ({ enviarVideo: vi.fn() }))

const enviarMock = vi.mocked(enviarVideo)

function selecionarArquivo(wrapper: VueWrapper, arquivo: File) {
  const input = wrapper.find('#arquivo')
  Object.defineProperty(input.element, 'files', { value: [arquivo], configurable: true })
  return input.trigger('change')
}

describe('UploadView', () => {
  beforeEach(() => {
    enviarMock.mockReset()
    useSessao().definir('jwt-123')
  })

  it('exige um arquivo antes de enviar', async () => {
    const wrapper = mount(UploadView)
    await wrapper.find('form').trigger('submit')
    expect(enviarMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Selecione um arquivo')
  })

  it('envia o vídeo selecionado com o token', async () => {
    enviarMock.mockResolvedValue({ videoId: 'v1', status: 'PENDENTE' })
    const wrapper = mount(UploadView)
    const arquivo = new File(['x'], 'a.mp4', { type: 'video/mp4' })
    await selecionarArquivo(wrapper, arquivo)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(enviarMock).toHaveBeenCalledWith(arquivo, 'jwt-123')
    expect(wrapper.text()).toContain('processamento')
  })

  it('mostra a mensagem de erro da API', async () => {
    enviarMock.mockRejectedValue(new ErroApi('Não autorizado', 401))
    const wrapper = mount(UploadView)
    await selecionarArquivo(wrapper, new File(['x'], 'a.mp4', { type: 'video/mp4' }))
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Não autorizado')
  })
})
