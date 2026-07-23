import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginView from '../LoginView.vue'
import { entrar } from '../../services/autenticacao'
import { ErroApi } from '../../services/http'
import { useSessao } from '../../composables/useSessao'

vi.mock('../../services/autenticacao', () => ({
  entrar: vi.fn(),
}))

const entrarMock = vi.mocked(entrar)

function montar() {
  return mount(LoginView, { global: { stubs: { RouterLink: true } } })
}

describe('LoginView', () => {
  beforeEach(() => {
    entrarMock.mockReset()
    useSessao().limpar()
  })

  it('não envia quando os campos são inválidos', async () => {
    const wrapper = montar()
    await wrapper.find('form').trigger('submit')
    expect(entrarMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('e-mail válido')
  })

  it('entra e guarda a sessão com credenciais válidas', async () => {
    entrarMock.mockResolvedValue({ token: 'jwt-123' })
    const wrapper = montar()
    await wrapper.find('#email').setValue('a@b.com')
    await wrapper.find('#senha').setValue('senhaforte1')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(entrarMock).toHaveBeenCalledWith({ email: 'a@b.com', senha: 'senhaforte1' })
    expect(useSessao().autenticado.value).toBe(true)
    expect(wrapper.text()).toContain('conectado')
  })

  it('mostra a mensagem de erro da API', async () => {
    entrarMock.mockRejectedValue(new ErroApi('Credenciais inválidas', 401))
    const wrapper = montar()
    await wrapper.find('#email').setValue('a@b.com')
    await wrapper.find('#senha').setValue('errada')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Credenciais inválidas')
    expect(useSessao().autenticado.value).toBe(false)
  })
})
