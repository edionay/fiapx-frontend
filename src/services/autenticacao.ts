import { postJson } from './http'

export interface Credenciais {
  email: string
  senha: string
}

export interface UsuarioResumo {
  id: string
  email: string
}

export function cadastrar(credenciais: Credenciais): Promise<UsuarioResumo> {
  return postJson<UsuarioResumo>('/auth/cadastro', credenciais)
}
