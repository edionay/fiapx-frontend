import { postForm } from './http'

export interface VideoEnviado {
  videoId: string
  status: string
}

export function enviarVideo(arquivo: File, token: string): Promise<VideoEnviado> {
  const form = new FormData()
  form.append('arquivo', arquivo)
  return postForm<VideoEnviado>('/videos', form, token)
}
