<template>
    <v-app-bar color="teal" elevation="10" class="text-white">
        <v-hmtl class="ml-4">
            <p class="text-h6">SiCamping Barokah</p>
            <p class="text-caption">Sistem Canteen RS PKU Muhammadiyah Gamping Barokah</p>
        </v-hmtl>
    </v-app-bar>
    <v-navigation-drawer permanent>
        <v-list class="mt-4 text-teal-darken-3">
            <v-list-item :prepend-avatar="avatarSrc" title="Pegawai" subtitle="Kantin Barokah"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list class="text-teal-darken-3" density="compact" nav>
            <v-list-item v-for="item in links" :key="index" :prepend-icon="item.icon" :title="item.title"
                :to="item.route"></v-list-item>
        </v-list>
        <v-btn class="mb-6" location="bottom" position="absolute" variant="outlined" color="red"
            @click="logOut">Keluar</v-btn>
    </v-navigation-drawer>
</template>
<script>
import { useAuthStore } from '@/store/authStore';
import avatar from '@/assets/avatar.jpg'
export default {
    data() {
        return {
            links: [
                { icon: "mdi-home", title: "Beranda", route: "/beranda" },
                { icon: "mdi-store", title: "Produk", route: "/produk" },
                { icon: "mdi-chart-line", title: "Laporan", route: "/laporan" },
                { icon: "mdi-cash-multiple", title: "Transaksi", route: "/transaksi" }
            ],
            avatarSrc: avatar
        }
    },
    methods: {
        logOut() {
            useAuthStore().logout()
            this.$router.push('/login')
        }
    },
}
</script>