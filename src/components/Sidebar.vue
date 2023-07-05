<template>
    <v-app-bar color="white" elevation="10" title="Kantin Barokah" class="text-teal">
    </v-app-bar>
    <v-navigation-drawer permanent>
        <v-list class="mt-4 text-teal-darken-3">
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
                subtitle="sandra_a88@gmailcom"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list class="text-teal-darken-3" density="compact" nav>
            <v-list-item v-for="item in links" :key="index" :prepend-icon="item.icon" :title="item.title"
                :to="item.route"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    data() {
        return {
            links: [
                { icon: "mdi-home", title: "Beranda", route: "/beranda" },
                { icon: "mdi-store", title: "Produk", route: "/produk" },
                { icon: "mdi-chart-line", title: "Laporan", route: "/laporan" }
            ]
        }
    },
}
</script>