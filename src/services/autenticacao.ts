import { postJson } from './http'

export interface Credenciais {
  email: string
  senha: string
}

export interface UsuarioResumo {
  id: string
  email: string
}

export interface Sessao {
  token: string
}

export function cadastrar(credenciais: Credenciais): Promise<UsuarioResumo> {
  return postJson<UsuarioResumo>('/auth/cadastro', credenciais)
}

export function entrar(credenciais: Credenciais): Promise<Sessao> {
  return postJson<Sessao>('/auth/login', credenciais)
}
