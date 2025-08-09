// Composables
import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/layouts/LoginPage.vue";
import Dashboard from "@/layouts/Dashboard.vue";
import Beranda from "@/views/Beranda.vue";
import Produk from "@/views/Produk.vue";
import Laporan from "@/views/Laporan.vue";
import Transaksi from "@/views/Transaksi.vue";
import TambahTrans from "@/views/TambahTrans.vue";

import { useAuthStore } from "@/store/authStore";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/",
    redirect: "/beranda",
    name: "dashboard",
    component: Dashboard,
    children: [
      {
        path: "beranda",
        name: "beranda",
        component: Beranda,
      },
      {
        path: "produk",
        name: "produk",
        component: Produk,
      },
      {
        path: "laporan",
        name: "laporan",
        component: Laporan,
      },
      {
        path: "transaksi",
        name: "transaksi",
        component: Transaksi,
      },
      {
        path: "tambahtrans",
        name: "tambahtrans",
        component: TambahTrans,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isLoggedIn;
  if (to.name !== "login" && !isAuth) next({ name: "login" });
  if (to.name == "login" && isAuth) next({ name: "home" });
  else next();
});
export default router;
