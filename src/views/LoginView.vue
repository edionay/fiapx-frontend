<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { entrar } from '../services/autenticacao'
import { ErroApi } from '../services/http'
import { useSessao } from '../composables/useSessao'

const { autenticado, definir, limpar } = useSessao()

const classeCampo =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900'

const form = reactive({ email: '', senha: '' })
const erros = reactive<{ email?: string; senha?: string }>({})
const erroGeral = ref('')
const enviando = ref(false)

function validar(): boolean {
  erros.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? undefined
    : 'Informe um e-mail válido.'
  erros.senha = form.senha.length > 0 ? undefined : 'Informe sua senha.'

  return !erros.email && !erros.senha
}

async function enviar(): Promise<void> {
  erroGeral.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    const sessao = await entrar({ email: form.email, senha: form.senha })
    definir(sessao.token)
  } catch (erro) {
    erroGeral.value = erro instanceof ErroApi ? erro.message : 'Não foi possível entrar.'
  } finally {
    enviando.value = false
  }
}

function sair(): void {
  limpar()
  form.email = ''
  form.senha = ''
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <template v-if="autenticado">
        <h2 class="text-xl font-semibold text-slate-900">Você está conectado</h2>
        <p class="mt-1 text-sm text-slate-500">Sua sessão está ativa neste dispositivo.</p>
        <RouterLink
          to="/enviar"
          class="mt-6 block w-full rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
        >
          Enviar vídeo
        </RouterLink>
        <button
          type="button"
          class="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="sair"
        >
          Sair
        </button>
      </template>

      <template v-else>
        <h2 class="text-xl font-semibold text-slate-900">Entrar</h2>
        <p class="mt-1 text-sm text-slate-500">Acesse sua conta para enviar e acompanhar vídeos.</p>

        <form novalidate class="mt-6 space-y-4" @submit.prevent="enviar">
          <p
            v-if="erroGeral"
            role="alert"
            class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ erroGeral }}
          </p>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              :class="classeCampo"
              :aria-invalid="Boolean(erros.email)"
            />
            <p v-if="erros.email" class="mt-1 text-sm text-red-600">{{ erros.email }}</p>
          </div>

          <div>
            <label for="senha" class="block text-sm font-medium text-slate-700">Senha</label>
            <input
              id="senha"
              v-model="form.senha"
              type="password"
              autocomplete="current-password"
              :class="classeCampo"
              :aria-invalid="Boolean(erros.senha)"
            />
            <p v-if="erros.senha" class="mt-1 text-sm text-red-600">{{ erros.senha }}</p>
          </div>

          <button
            type="submit"
            :disabled="enviando"
            class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {{ enviando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Não tem conta?
          <RouterLink to="/cadastro" class="font-medium text-slate-900 hover:underline">
            Criar conta
          </RouterLink>
        </p>
      </template>
    </div>
  </div>
</template>
