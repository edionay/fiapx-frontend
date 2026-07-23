import { createRouter, createWebHistory } from 'vue-router'
import { useSessao } from '../composables/useSessao'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('../views/CadastroView.vue'),
    },
    {
      path: '/enviar',
      name: 'enviar',
      component: () => import('../views/UploadView.vue'),
      meta: { requerAuth: true },
    },
  ],
})

router.beforeEach((para) => {
  const { autenticado } = useSessao()
  if (para.meta.requerAuth && !autenticado.value) {
    return { name: 'login' }
  }
})

export default router
