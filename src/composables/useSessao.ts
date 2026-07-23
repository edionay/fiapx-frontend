import { computed, ref } from 'vue'

const CHAVE = 'fiapx.token'

const token = ref<string | null>(localStorage.getItem(CHAVE))

export function useSessao() {
  function definir(novo: string): void {
    token.value = novo
    localStorage.setItem(CHAVE, novo)
  }

  function limpar(): void {
    token.value = null
    localStorage.removeItem(CHAVE)
  }

  const autenticado = computed(() => token.value !== null)

  return { token, autenticado, definir, limpar }
}
