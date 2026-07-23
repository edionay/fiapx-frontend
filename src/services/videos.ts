import { getBlob, getJson, postForm } from './http'

export type StatusVideo = 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO'

export interface Video {
  id: string
  nomeOriginal: string
  status: StatusVideo
  mensagemErro: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface VideoEnviado {
  videoId: string
  status: string
}

export function enviarVideo(arquivo: File, token: string): Promise<VideoEnviado> {
  const form = new FormData()
  form.append('arquivo', arquivo)
  return postForm<VideoEnviado>('/videos', form, token)
}

export function listarVideos(token: string): Promise<Video[]> {
  return getJson<Video[]>('/videos', token)
}

export function baixarVideo(id: string, token: string): Promise<Blob> {
  return getBlob(`/videos/${id}/download`, token)
}
