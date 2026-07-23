import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('exibe o nome do sistema', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('FIAP X')
  })
})
