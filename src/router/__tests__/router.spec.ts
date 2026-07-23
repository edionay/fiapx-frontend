import { describe, it, expect, afterEach } from 'vitest'
import router from '../index'
import { useSessao } from '../../composables/useSessao'

afterEach(() => {
  useSessao().limpar()
})

describe('router', () => {
  it('cria a instância do roteador', () => {
    expect(typeof router.push).toBe('function')
    expect(Array.isArray(router.getRoutes())).toBe(true)
  })

  it('redireciona /enviar para o login quando não autenticado', async () => {
    useSessao().limpar()
    await router.push('/enviar')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('libera /enviar quando autenticado', async () => {
    useSessao().definir('jwt-123')
    await router.push('/enviar')
    expect(router.currentRoute.value.name).toBe('enviar')
  })
})
