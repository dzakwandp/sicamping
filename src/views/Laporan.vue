<template lang="">
  <v-container>
    <v-card
      variant="flat"
      color="blue-darken-4"
      density="comfortable"
      class="text-white"
    >
      <v-card-title class="text-center text-h4 mt-4"
        >Laporan Penjualan
      </v-card-title>
      <v-card-text class="text-center text-body-1"
        >Di Sistem Kantin Barokah
      </v-card-text>
      <v-card-text class="text-right mt-n10">{{
        timeStore.formattedTime
      }}</v-card-text>
    </v-card>
  </v-container>
  <v-container class="d-flex ml-0 justify-space-between">
    <div class="w-50">
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
          <VueDatePicker
            v-model="startDate"
            auto-apply
            model-type="yyyy-MM-dd"
            :month-change-on-scroll="false"
            :format="dpFormat"
          />
        </v-col>
        <v-col>
          <VueDatePicker
            v-model="endDate"
            auto-apply
            model-type="yyyy-MM-dd"
            :month-change-on-scroll="false"
            :format="dpFormat"
          />
        </v-col>
        <v-col>
          <v-btn
            class="text-body-1"
            color="blue-darken-4"
            @click="submitReport(), (loading = true)"
            >Lihat</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <div class="w-25 justify-start pr-2">
      <v-row> Filter Kantin </v-row>
      <v-row>
        <v-select
          v-model="selectedKantin"
          variant="outlined"
          density="compact"
          :items="kantin"
          item-title="label"
          item-value="value"
          clearable
        />
      </v-row>
    </div>
  </v-container>
  <v-container>
    <EasyDataTable
      class="text-body-1"
      :headers="headers"
      :items="items"
      theme-color="#0D47A1"
      table-class-name="custom-table"
      :loading="loading"
    >
      <template #item-total_modal="item">
        {{ formatCurrency(item.total_modal) }}
      </template>
      <template #item-total_harga_jual="item">
        {{ formatCurrency(item.total_harga_jual) }}
      </template>
      <template #item-laba="item">
        {{ formatCurrency(item.laba) }}
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
              <p>: {{ totalLaba.sum_terjual }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <p>Total Modal</p>
            </v-col>
            <v-col class="py-0">
              <p>: {{ formatCurrency(totalLaba.sum_modal) }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <p>Total Harga Terjual</p>
            </v-col>
            <v-col class="py-0">
              <p>: {{ formatCurrency(totalLaba.sum_hargajual) }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <p>Total Laba</p>
            </v-col>
            <v-col class="py-0">
              <p>: {{ formatCurrency(totalLaba.sum_laba) }}</p>
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
      kantin: [
        { label: "Kantin Bu Dar", value: "budar" },
        { label: "Kantin Bu Cahyo", value: "cahyo" },
        { label: "Kantin Jatim", value: "jatim" },
        { label: "Kantin Bu Meli", value: "meli" },
        { label: "Kantin Padang", value: "padang" },
        { label: "Kantin IKP", value: "ikp" },
      ],
      selectedKantin: null,
      items: [],
      defaultItems: [],
      totalLaba: [],
      enableTotal: false,
      loading: false,
      startDate: moment().format("YYYY-MM-D"),
      endDate: moment().format("YYYY-MM-D"),
      dpFormat: (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "/" + month + "/" + year;
      },
    };
  },
  methods: {
    async submitReport() {
      try {
        const dataReport = await axios.post(
          useEnvStore().apiUrl + "report/range",
          {
            start_date: this.startDate,
            end_date: this.endDate,
          }
        );
        this.items = dataReport.data.data;
        this.defaultItems = dataReport.data.data;
        console.log(dataReport.data.sum_data);
        // set total data
        this.totalLaba = this.items.reduce(
          (acc, item) => {
            acc.sum_terjual += item.total_terjual;
            acc.sum_modal += item.total_modal;
            acc.sum_hargajual += item.total_harga_jual;
            acc.sum_laba += item.laba;
            return acc;
          },
          {
            sum_terjual: 0,
            sum_modal: 0,
            sum_hargajual: 0,
            sum_laba: 0,
          }
        );
        this.enableTotal = true;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumSignificantDigits: 3,
      }).format(value);
    },
  },
  watch: {
    selectedKantin(val) {
      console.log(val);
      if (val === null) {
        this.items = this.defaultItems;
        // set total data
        this.totalLaba = this.items.reduce(
          (acc, item) => {
            acc.sum_terjual += item.total_terjual;
            acc.sum_modal += item.total_modal;
            acc.sum_hargajual += item.total_harga_jual;
            acc.sum_laba += item.laba;
            return acc;
          },
          {
            sum_terjual: 0,
            sum_modal: 0,
            sum_hargajual: 0,
            sum_laba: 0,
          }
        );
        return;
      }
      if (val === "ikp") {
        const excluded = ["cahyo", "budar", "meli", "padang", "BBH", "jatim"];
        this.items = this.defaultItems.filter(
          (item) => !excluded.some((keyword) => item.barang.includes(keyword))
        );
        // set total data
        this.totalLaba = this.items.reduce(
          (acc, item) => {
            acc.sum_terjual += item.total_terjual;
            acc.sum_modal += item.total_modal;
            acc.sum_hargajual += item.total_harga_jual;
            acc.sum_laba += item.laba;
            return acc;
          },
          {
            sum_terjual: 0,
            sum_modal: 0,
            sum_hargajual: 0,
            sum_laba: 0,
          }
        );
      } else {
        this.items = this.defaultItems.filter((item) =>
          item.barang.includes(val)
        );
        // set total data
        this.totalLaba = this.items.reduce(
          (acc, item) => {
            acc.sum_terjual += item.total_terjual;
            acc.sum_modal += item.total_modal;
            acc.sum_hargajual += item.total_harga_jual;
            acc.sum_laba += item.laba;
            return acc;
          },
          {
            sum_terjual: 0,
            sum_modal: 0,
            sum_hargajual: 0,
            sum_laba: 0,
          }
        );
      }
    },
  },
  mounted() {
    console.log(this.startDate);
  },
};
</script>
<style>
.custom-table {
  --easy-table-footer-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>
