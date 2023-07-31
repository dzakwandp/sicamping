<template>
  <v-container>
    <v-card variant="outlined" color="teal" density="comfortable" class="card-border">
      <v-card-title class="text-center text-h4 mt-4">Selamat Datang!</v-card-title>
      <v-card-text class="text-center text-body-1">Di Sistem Kantin Barokah</v-card-text>
      <v-card-text class="text-right">{{ timeStore.formattedTime }}</v-card-text>
    </v-card>
  </v-container>

  <v-container class="d-flex flex-row justify-center">
    <v-card class="w-100 mr-4" variant="tonal" color="deep-purple">
      <v-btn position="absolute" location="right top" icon="mdi-refresh-circle" variant="icon" color="deep-purple"
        @click="loading = true, getPenjualan()"></v-btn>
      <v-card-title>Total Penjualan Hari Ini</v-card-title>
      <v-card-text class="text-center">
        <v-progress-circular v-if=loading color="deep-purple" :size="128" :width="12" indeterminate></v-progress-circular>
        <v-table v-else>
          <thead>
            <tr>
              <th class="text-left">
                Barang
              </th>
              <th class="text-left">
                Jumlah
              </th>
              <th class="text-left">
                Laba
              </th>
            </tr>
          </thead>
          <tbody class="text-left">
            <tr v-for="item in items" :key="item.id_barang">
              <td>{{ item.barang }}</td>
              <td class="pl-10">{{ item.total_terjual }}</td>
              <td>{{ formatCurrency(item.laba) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
    <v-card class="w-100 ml-4" variant="tonal" color="deep-orange">
      <v-img :src="image"></v-img>
    </v-card>
  </v-container>

  <v-dialog v-model="dialogTambah" width="auto">
    <template v-slot:activator="{ props }">
      <v-btn prepend-icon="mdi-plus" elevation="8" location="bottom right" position="fixed" class="mr-4 mb-4 text-body-1"
        color="teal" v-bind="props">Tambah Transaksi</v-btn>
    </template>
    <TambahTrans @update-dialog-state="updateDialogTambah" />
  </v-dialog>
</template>

<script>
import TambahTrans from '@/components/Transaksi/TambahTrans.vue'
import { useEnvStore } from '@/store/envStore'
import { useTimeStore } from '@/store/timeStore'
import image from '@/assets/homeimg.png'

import moment from 'moment'
import axios from 'axios'
export default {
  components: { TambahTrans },
  setup() {
    const timeStore = useTimeStore()

    setInterval(() => {
      timeStore.updateTime()
    }, 1000)

    // **only return the whole store** instead of destructuring
    return { timeStore }
  },
  data() {
    return {
      dialogTambah: false,
      date: moment().format('YYYY-MM-D'),
      items: [],
      image: image,
      loading: true
    }
  },
  methods: {
    updateDialogTambah(newState) {
      this.dialogTambah = newState;
    },
    async getPenjualan() {
      try {
        const penjualan = await axios.post(useEnvStore().apiUrl + "report/range", {
          start_date: this.date,
          end_date: this.date
        })
        this.items = penjualan.data.data
        this.loading = false
      }
      catch (err) {
        console.log(err)
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumSignificantDigits: 3
      }).format(value);
    }
  },
  mounted() {
    this.getPenjualan()
  },
}
</script>

<style scoped>
.card-border {
  border-width: 3px;
}
</style>
