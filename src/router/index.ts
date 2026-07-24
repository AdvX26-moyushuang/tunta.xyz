import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Index from '../pages/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
