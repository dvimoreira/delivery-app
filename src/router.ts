import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'layout.auth',
    component: () => import(/* webpackChunkName: "layout-default" */ './layouts/Auth.vue'),
    meta: { auth: false },
    children: [
        {
            path: '',
            name: 'page.auth',
            component: () => import(/* webpackChunkName: "page-login" */ './pages/Login.vue'),
            meta: { auth: false }
        },
    ]
  },
  {
    path: '/painel',
    name: 'layout.default',
    component: () => import(/* webpackChunkName: "layout-default" */ './layouts/Default.vue'),
    meta: { auth: true },
    children: [
      {
        path: 'pedidos',
        name: 'pedidos',
        component: () => import(/* webpackChunkName: "page-pedidos" */ './pages/Pedidos.vue'),
        meta: { auth: true }
      },
      {
        path: 'areas-entrega',
        name: 'areas-entrega',
        component: () => import(/* webpackChunkName: "page-areas-entrega" */ './pages/AreaEntrega.vue'),
        meta: { auth: true }
      },
      {
        path: 'cardapio',
        name: 'cardapio',
        component: () => import(/* webpackChunkName: "page-cardapio" */ './pages/Cardapio.vue'),
        meta: { auth: true }
      },
      {
        path: 'categorias',
        name: 'categorias',
        component: () => import(/* webpackChunkName: "page-categorias" */ './pages/Categorias.vue'),
        meta: { auth: true }
      },
      {
        path: 'configuracoes',
        name: 'configuracoes',
        component: () => import(/* webpackChunkName: "page-configuracoes" */ './pages/Configuracoes.vue'),
        meta: { auth: true }
      },
      {
        path: 'financeiro',
        name: 'financeiro',
        component: () => import(/* webpackChunkName: "page-financeiro" */ './pages/Financeiro.vue'),
        meta: { auth: true }
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
