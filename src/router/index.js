// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/layouts/Dashboard.vue'
import Beranda from '@/views/Beranda.vue'
import Produk from '@/views/Produk.vue'
import Laporan from '@/views/Laporan.vue'

const routes = [
  {
    path: '/',
    redirect: '/beranda',
    name: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: 'beranda',
        name: 'beranda',
        component: Beranda,
      },
      {
        path: 'produk',
        name: 'produk',
        component: Produk
      },
      {
        path: 'laporan',
        name: 'laporan',
        component: Laporan
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
