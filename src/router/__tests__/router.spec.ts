import { describe, it, expect } from 'vitest'
import router from '../index'

describe('router', () => {
  it('cria a instância do roteador', () => {
    expect(typeof router.push).toBe('function')
    expect(Array.isArray(router.getRoutes())).toBe(true)
  })
})
