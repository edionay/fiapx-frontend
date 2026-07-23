<script setup lang="ts"></script>

<template>
  <header class="cabecalho">
    <h1 class="titulo">FIAP X</h1>
    <p class="subtitulo">Processamento de vídeos</p>
  </header>
  <main class="conteudo"></main>
</template>

<style scoped>
.cabecalho {
  padding: 2rem 0 1rem;
  border-bottom: 1px solid var(--color-border);
}

.titulo {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-heading);
}

.subtitulo {
  color: var(--color-text);
  opacity: 0.8;
}

.conteudo {
  padding: 2rem 0;
}
</style>
