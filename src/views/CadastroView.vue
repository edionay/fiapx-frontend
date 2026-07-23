<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { cadastrar } from '../services/autenticacao'
import { ErroApi } from '../services/http'

const classeCampo =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900'

const form = reactive({ email: '', senha: '', confirmacao: '' })
const erros = reactive<{ email?: string; senha?: string; confirmacao?: string }>({})
const erroGeral = ref('')
const enviando = ref(false)
const concluido = ref(false)

function validar(): boolean {
  erros.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? undefined
    : 'Informe um e-mail válido.'
  erros.senha = form.senha.length >= 8 ? undefined : 'A senha deve ter ao menos 8 caracteres.'
  erros.confirmacao = form.confirmacao === form.senha ? undefined : 'As senhas não coincidem.'

  return !erros.email && !erros.senha && !erros.confirmacao
}

async function enviar(): Promise<void> {
  erroGeral.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    await cadastrar({ email: form.email, senha: form.senha })
    concluido.value = true
  } catch (erro) {
    erroGeral.value =
      erro instanceof ErroApi ? erro.message : 'Não foi possível concluir o cadastro.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900">Criar conta</h2>
      <p class="mt-1 text-sm text-slate-500">Use seu e-mail e uma senha para começar.</p>

      <div v-if="concluido" class="mt-6">
        <p role="status" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Conta criada com sucesso.
        </p>
        <p class="mt-6 text-center text-sm text-slate-500">
          <RouterLink to="/login" class="font-medium text-slate-900 hover:underline">
            Ir para o login
          </RouterLink>
        </p>
      </div>

      <form v-else novalidate class="mt-6 space-y-4" @submit.prevent="enviar">
        <p v-if="erroGeral" role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
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
            autocomplete="new-password"
            :class="classeCampo"
            :aria-invalid="Boolean(erros.senha)"
          />
          <p v-if="erros.senha" class="mt-1 text-sm text-red-600">{{ erros.senha }}</p>
        </div>

        <div>
          <label for="confirmacao" class="block text-sm font-medium text-slate-700">
            Confirmar senha
          </label>
          <input
            id="confirmacao"
            v-model="form.confirmacao"
            type="password"
            autocomplete="new-password"
            :class="classeCampo"
            :aria-invalid="Boolean(erros.confirmacao)"
          />
          <p v-if="erros.confirmacao" class="mt-1 text-sm text-red-600">{{ erros.confirmacao }}</p>
        </div>

        <button
          type="submit"
          :disabled="enviando"
          class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {{ enviando ? 'Criando...' : 'Criar conta' }}
        </button>

        <p class="text-center text-sm text-slate-500">
          Já tem conta?
          <RouterLink to="/login" class="font-medium text-slate-900 hover:underline">
            Entrar
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
