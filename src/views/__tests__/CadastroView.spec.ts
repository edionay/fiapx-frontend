import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CadastroView from '../CadastroView.vue'
import { cadastrar } from '../../services/autenticacao'
import { ErroApi } from '../../services/http'

vi.mock('../../services/autenticacao', () => ({
  cadastrar: vi.fn(),
}))

const cadastrarMock = vi.mocked(cadastrar)

async function preencher(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('#email').setValue('a@b.com')
  await wrapper.find('#senha').setValue('senhaforte1')
  await wrapper.find('#confirmacao').setValue('senhaforte1')
}

describe('CadastroView', () => {
  beforeEach(() => {
    cadastrarMock.mockReset()
  })

  it('não envia quando os campos são inválidos', async () => {
    const wrapper = mount(CadastroView, { global: { stubs: { RouterLink: true } } })
    await wrapper.find('form').trigger('submit')
    expect(cadastrarMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('e-mail válido')
  })

  it('valida a confirmação de senha', async () => {
    const wrapper = mount(CadastroView, { global: { stubs: { RouterLink: true } } })
    await wrapper.find('#email').setValue('a@b.com')
    await wrapper.find('#senha').setValue('senhaforte1')
    await wrapper.find('#confirmacao').setValue('outra-senha')
    await wrapper.find('form').trigger('submit')
    expect(cadastrarMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('não coincidem')
  })

  it('envia o cadastro com dados válidos e mostra sucesso', async () => {
    cadastrarMock.mockResolvedValue({ id: '1', email: 'a@b.com' })
    const wrapper = mount(CadastroView, { global: { stubs: { RouterLink: true } } })
    await preencher(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(cadastrarMock).toHaveBeenCalledWith({ email: 'a@b.com', senha: 'senhaforte1' })
    expect(wrapper.text()).toContain('sucesso')
  })

  it('mostra a mensagem de erro da API', async () => {
    cadastrarMock.mockRejectedValue(new ErroApi('E-mail já cadastrado', 409))
    const wrapper = mount(CadastroView, { global: { stubs: { RouterLink: true } } })
    await preencher(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('E-mail já cadastrado')
  })
})
