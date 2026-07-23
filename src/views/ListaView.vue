<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { baixarVideo, listarVideos, type StatusVideo, type Video } from '../services/videos'
import { ErroApi } from '../services/http'
import { useSessao } from '../composables/useSessao'

const router = useRouter()
const { token, limpar } = useSessao()

const videos = ref<Video[]>([])
const carregando = ref(false)
const erro = ref('')

const estilosStatus: Record<StatusVideo, string> = {
  PENDENTE: 'bg-slate-100 text-slate-700',
  PROCESSANDO: 'bg-amber-100 text-amber-800',
  CONCLUIDO: 'bg-emerald-100 text-emerald-800',
  ERRO: 'bg-red-100 text-red-700',
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR')
}

async function carregar(): Promise<void> {
  if (token.value === null) return
  carregando.value = true
  erro.value = ''
  try {
    videos.value = await listarVideos(token.value)
  } catch (causa) {
    erro.value =
      causa instanceof ErroApi ? causa.message : 'Não foi possível carregar os vídeos.'
  } finally {
    carregando.value = false
  }
}

async function baixar(video: Video): Promise<void> {
  if (token.value === null) return
  try {
    const blob = await baixarVideo(video.id, token.value)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${video.id}.zip`
    link.click()
    URL.revokeObjectURL(url)
  } catch (causa) {
    erro.value =
      causa instanceof ErroApi ? causa.message : 'Não foi possível baixar o pacote.'
  }
}

function sair(): void {
  limpar()
  void router.push('/login')
}

onMounted(carregar)
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">Meus vídeos</h2>
      <div class="flex items-center gap-4 text-sm font-medium">
        <RouterLink to="/enviar" class="text-slate-500 hover:text-slate-900">Enviar vídeo</RouterLink>
        <button type="button" class="text-slate-500 hover:text-slate-900" @click="carregar">
          Atualizar
        </button>
        <button type="button" class="text-slate-500 hover:text-slate-900" @click="sair">Sair</button>
      </div>
    </div>

    <p v-if="erro" role="alert" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ erro }}
    </p>

    <p v-if="carregando" class="text-sm text-slate-500">Carregando...</p>

    <p
      v-else-if="videos.length === 0"
      class="rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500"
    >
      Você ainda não enviou nenhum vídeo.
    </p>

    <ul v-else class="space-y-3">
      <li
        v-for="video in videos"
        :key="video.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate font-medium text-slate-900">{{ video.nomeOriginal }}</p>
            <p class="text-xs text-slate-400">{{ formatarData(video.criadoEm) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="estilosStatus[video.status]"
            >
              {{ video.status }}
            </span>
            <button
              v-if="video.status === 'CONCLUIDO'"
              type="button"
              class="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              @click="baixar(video)"
            >
              Baixar
            </button>
          </div>
        </div>
        <p v-if="video.status === 'ERRO' && video.mensagemErro" class="mt-2 text-sm text-red-600">
          {{ video.mensagemErro }}
        </p>
      </li>
    </ul>
  </div>
</template>
