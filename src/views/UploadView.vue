<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { enviarVideo, type VideoEnviado } from '../services/videos'
import { ErroApi } from '../services/http'
import { useSessao } from '../composables/useSessao'

const router = useRouter()
const { token, limpar } = useSessao()

const arquivo = ref<File | null>(null)
const erro = ref('')
const enviando = ref(false)
const enviado = ref<VideoEnviado | null>(null)

function selecionar(evento: Event): void {
  const alvo = evento.target as HTMLInputElement
  arquivo.value = alvo.files?.[0] ?? null
  erro.value = ''
  enviado.value = null
}

async function enviar(): Promise<void> {
  erro.value = ''
  if (arquivo.value === null) {
    erro.value = 'Selecione um arquivo de vídeo.'
    return
  }
  if (token.value === null) {
    erro.value = 'Sua sessão expirou. Entre novamente.'
    return
  }

  enviando.value = true
  try {
    enviado.value = await enviarVideo(arquivo.value, token.value)
  } catch (causa) {
    erro.value = causa instanceof ErroApi ? causa.message : 'Não foi possível enviar o vídeo.'
  } finally {
    enviando.value = false
  }
}

function sair(): void {
  limpar()
  void router.push('/login')
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">Enviar vídeo</h2>
      <div class="flex items-center gap-4 text-sm font-medium">
        <RouterLink to="/videos" class="text-slate-500 hover:text-slate-900">Meus vídeos</RouterLink>
        <button type="button" class="text-slate-500 hover:text-slate-900" @click="sair">Sair</button>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm text-slate-500">
        Escolha um arquivo de vídeo para processar. Você acompanha o status na lista de vídeos.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="enviar">
        <p v-if="erro" role="alert" class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ erro }}
        </p>

        <input
          id="arquivo"
          type="file"
          accept="video/*"
          class="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
          @change="selecionar"
        />

        <button
          type="submit"
          :disabled="enviando"
          class="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {{ enviando ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>

      <div v-if="enviado" class="mt-6">
        <p role="status" class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Vídeo recebido e na fila de processamento (status {{ enviado.status }}).
        </p>
        <RouterLink
          to="/videos"
          class="mt-3 block text-center text-sm font-medium text-slate-900 hover:underline"
        >
          Acompanhar em meus vídeos
        </RouterLink>
      </div>
    </div>
  </div>
</template>
