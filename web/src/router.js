import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: '_index',
    component: Main,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('./views/dashboard/Index.vue')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
