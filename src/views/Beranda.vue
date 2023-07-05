<template>
  <v-container>
    <v-card variant="outlined" color="teal" density="comfortable" class="card-border">
      <v-card-title class="text-center text-h4 mt-4">Selamat Datang!</v-card-title>
      <v-card-text class="text-center text-body-1">Di Sistem Kantin Barokah</v-card-text>
      <v-card-text class="text-right">Ticking time</v-card-text>
    </v-card>
  </v-container>

  <v-container class="d-flex flex-row justify-center">
    <v-card class="w-100 mr-4" variant="tonal" color="deep-purple">
      <v-card-title>Total Penjualan Hari Ini</v-card-title>
    </v-card>
    <v-card class="w-100 ml-4" variant="tonal" color="deep-orange">
      <v-card-title>Title 2</v-card-title>
    </v-card>
  </v-container>

  <v-dialog v-model="dialogTambah" width="auto">
    <template v-slot:activator="{ props }">
      <v-btn prepend-icon="mdi-plus" elevation="8" location="bottom right" position="absolute"
        class="mr-4 mb-4 text-body-1" color="teal" v-bind="props">Tambah Transaksi</v-btn>
    </template>
    <TambahTrans></TambahTrans>
  </v-dialog>
</template>

<script>
import TambahTrans from '@/components/TambahTrans.vue'
import { useEnvStore } from '@/store/envStore'

import axios from 'axios'
export default {
  components: { TambahTrans },
  setup() {
    const envStore = useEnvStore()
    return { envStore }
  },
  data() {
    return {
      dialogTambah: false
    }
  },
  async mounted() {
    try {
      const tryapi = await axios.get('https://canteen-project-2525c7dc7436.herokuapp.com/barangs/')
      console.log(useEnvStore().apiUrl)
      console.log(tryapi)
    }
    catch (err) {
      console.log(err)
    }
  },
}
</script>

<style scoped>
.card-border {
  border-width: 3px;
}
</style>
