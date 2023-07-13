<template lang="">
  <v-container>
    <v-card
      variant="flat"
      color="blue-darken-4"
      density="comfortable"
      class="text-white">
      <v-card-title class="text-center text-h4 mt-4">Laporan Penjualan
        </v-card-title>
      <v-card-text class="text-center text-body-1">Di Sistem Kantin Barokah
        </v-card-text>
      <v-card-text class="text-right mt-n10">{{timeStore.formattedTime}}</v-card-text>
    </v-card>
  </v-container>
  <v-container class="w-75 ml-0">
    <v-row class="text-body-1">
      <v-col class="py-0">
        <p>Tanggal Mulai</p>
      </v-col>
      <v-col class="py-0">
        <p>Tanggal Akhir</p>
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>
        <VueDatePicker class="" v-model="startDate" model-type="yyyy-MM-dd" :month-change-on-scroll=false />
      </v-col>
      <v-col>
        <VueDatePicker class="" v-model="endDate" model-type="yyyy-MM-dd" :month-change-on-scroll=false />
      </v-col>
      <v-col>
        <v-btn class="text-body-1" color="blue-darken-4" @click="submitReport(), loading=true">Lihat</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <EasyDataTable class="text-body-1" :headers="headers" :items="items" theme-color="#0D47A1" table-class-name="custom-table" :loading=loading>
      <template #item-total_modal="item">
        {{formatCurrency(item.total_modal)}}
      </template>
      <template #item-total_harga_jual="item">
        {{formatCurrency(item.total_harga_jual)}}
      </template>
      <template #item-laba="item">
        {{formatCurrency(item.laba)}}
      </template>
    </EasyDataTable>
    <v-card class="w-50" variant="flat">
      <v-card-text v-if="enableTotal">
        <v-container class="ml-0 mt-2 pa-0">
        <v-row>
          <v-col class="py-0">
            <p>Total Barang Terjual</p>
          </v-col>
          <v-col class="py-0">
            <p>: {{totalLaba[0].sum_terjual}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <p>Total Modal</p>
          </v-col>
          <v-col class="py-0">
            <p>: {{formatCurrency(totalLaba[0].sum_modal)}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <p>Total Harga Terjual</p>
          </v-col>
          <v-col class="py-0">
            <p>: {{formatCurrency(totalLaba[0].sum_hargajual)}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <p>Total Laba</p>
          </v-col>
          <v-col class="py-0">
            <p>: {{formatCurrency(totalLaba[0].sum_laba)}}</p>
          </v-col>
        </v-row>
      </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { useEnvStore } from "@/store/envStore";
import { useTimeStore } from "@/store/timeStore";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import moment from "moment";
import axios from "axios";
export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
    VueDatePicker,
  },
  setup() {
    const timeStore = useTimeStore();

    setInterval(() => {
      timeStore.updateTime();
    }, 1000);

    // **only return the whole store** instead of destructuring
    return { timeStore };
  },
  data() {
    return {
      headers: [
        { text: "BARANG", value: "barang" },
        { text: "JUMLAH TERJUAL", value: "total_terjual" },
        { text: "TOTAL MODAL", value: "total_modal" },
        { text: "TOTAL HARGA JUAL", value: "total_harga_jual" },
        { text: "LABA", value: "laba" },
      ],
      items: [],
      totalLaba: [],
      enableTotal: false,
      loading: false,
      startDate: moment().format('YYYY-MM-D'),
      endDate: moment().format('YYYY-MM-D'),
    };
  },
  methods: {
    async submitReport() {
      try {
        const dataReport = await axios.post(useEnvStore().apiUrl + "report/range", {
          start_date: this.startDate,
          end_date: this.endDate
        })
        this.items = dataReport.data.data
        this.totalLaba = dataReport.data.sum_data
        this.enableTotal = true
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
    console.log(this.startDate)
  },
};
</script>
<style>
.custom-table {
  --easy-table-footer-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>
