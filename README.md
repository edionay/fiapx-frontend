# fiapx-frontend

Interface web do **Sistema de Processamento de Vídeos FIAP X**. Consome a API para
autenticação, envio de vídeo, acompanhamento de status e download dos pacotes gerados.

> Visão geral do sistema, contratos de fila e decisões de arquitetura vivem no
> repositório [`fiapx-infra`](https://github.com/edionay/fiapx-infra).

## Stack

- **Vue** 3 (Composition API, `<script setup>`)
- **Vue Router** para navegação
- **Vite** para build e desenvolvimento
- **TypeScript**
- **Tailwind CSS** (v4, via plugin do Vite) para estilização
- **Vitest** + **Vue Test Utils** para testes
- **ESLint** e **oxlint** para análise estática

## Pré-requisitos

- Node ≥ 22 e npm.

## Configuração

O endereço da API vem da variável `VITE_API_URL` (ver [`.env.example`](.env.example)). Sem ela,
o padrão é `http://localhost:3000`.

## Instalação

```bash
npm install
```

## Como rodar

```bash
# desenvolvimento (servidor com hot reload)
npm run dev

# build de produção em dist/
npm run build

# pré-visualização do build
npm run preview
```

## Testes

```bash
npm run test:unit
```

## Verificação de tipos

```bash
npm run type-check
```

## Lint

```bash
npm run lint
```

## Integração contínua

O workflow em `.github/workflows/ci.yml` roda a cada pull request e push na `main`, executando
verificação de tipos, lint, testes e build.

## Estrutura

```
index.html                    # ponto de entrada do Vite
vite.config.ts                # configuração do Vite
vitest.config.ts              # configuração dos testes
eslint.config.ts              # configuração do ESLint
src/
├── main.ts                   # bootstrap da aplicação Vue
├── App.vue                   # componente raiz
├── router/                   # configuração do Vue Router
├── views/                    # telas (login e cadastro)
├── services/                 # cliente HTTP e chamadas à API
├── composables/              # estado de sessão (token JWT)
├── assets/                   # estilos base
└── __tests__/                # testes de unidade
```
