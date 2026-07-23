import { describe, it, expect, beforeEach } from 'vitest'
import { useSessao } from '../useSessao'

describe('useSessao', () => {
  beforeEach(() => {
    useSessao().limpar()
  })

  it('começa sem autenticação', () => {
    const { autenticado, token } = useSessao()
    expect(autenticado.value).toBe(false)
    expect(token.value).toBeNull()
  })

  it('guarda o token e marca como autenticado', () => {
    const { definir, autenticado, token } = useSessao()
    definir('jwt-123')
    expect(autenticado.value).toBe(true)
    expect(token.value).toBe('jwt-123')
    expect(localStorage.getItem('fiapx.token')).toBe('jwt-123')
  })

  it('limpa o token ao sair', () => {
    const sessao = useSessao()
    sessao.definir('jwt-123')
    sessao.limpar()
    expect(sessao.autenticado.value).toBe(false)
    expect(localStorage.getItem('fiapx.token')).toBeNull()
  })
})
