import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Pedidos from './pages/Pedidos.vue'
import AreaEntrega from './pages/AreaEntrega.vue'
import Cardapio from './pages/Cardapio.vue'
import Categorias from './pages/Categorias.vue'
import Configuracoes from './pages/Configuracoes.vue'
import Financeiro from './pages/Financeiro.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/',
        component: Login,
        meta: { layout: 'Auth' }
    },
    {
      path: '/pedidos',
      component: Pedidos,
      meta: { layout: 'Default' }
    },
    {
      path: '/areas-entrega',
      component: AreaEntrega,
      meta: { layout: 'Default' }
    },
    {
      path: '/cardapio',
      component: Cardapio,
      meta: { layout: 'Default' }
    },
    {
      path: '/categorias',
      component: Categorias,
      meta: { layout: 'Default' }
    },
    {
      path: '/configuracoes',
      component: Configuracoes,
      meta: { layout: 'Default' }
    },
    {
      path: '/financeiro',
      component: Financeiro,
      meta: { layout: 'Default' }
    }
  ]
})
