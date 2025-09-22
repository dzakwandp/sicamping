<template>
  <div class="d-flex" style="height: 89vh">
    <div
      class="d-flex flex-column h-100 w-30 justify-space-between pa-2"
      style="width: 50%"
    >
      <!-- <div
        class="px-8 py-2 d-flex flex-row align-start mt-4 position-sticky top-0"
      >
        <vue-select
          class="w-50 mr-4"
          v-model="selected"
          :options="dataBarang"
          label="barang"
          placeholder="Pilih Barang"
        >
        </vue-select>
        <v-text-field
          class="w-50 mx-4"
          v-model.number="jumlah"
          type="number"
          label="Jumlah"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-btn variant="outlined" @click="tambahItem">Tambahkan</v-btn>
      </div> -->
      <v-text-field
        
        variant="outlined"
        density="compact"
        label="Scanner Input"
        v-model="scannerValue"
        ref="scannerInput"
      ></v-text-field>
      <v-table height="350px" fixed-header>
        <thead>
          <tr>
            <th class="text-left">Barang</th>
            <th class="text-left">Harga (pcs)</th>
            <th class="text-left">Jumlah</th>
            <th class="text-left">Total</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in totalItem" :key="item.id_barang">
            <td>{{ item.barang }}</td>
            <td>{{ formatCurrency(item.harga_jual) }}</td>
            <td>{{ item.Jumlah }}</td>
            <td>{{ formatCurrency(item.total_harga) }}</td>
            <td>
              <v-btn
                variant="text"
                icon="mdi-minus"
                color="red"
                @click="hapusItem(item.id), scannerInputFocus()"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-divider></v-divider>
      <v-card-text class="text-right">
        Total Harga: {{ formatCurrency(totalBayar) }}
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="submitTransaksi(), (loadingButton = true)"
          :loading="loadingButton"
          location="center"
          variant="outlined"
          color="blue-darken-4"
          >Konfirmasi</v-btn
        >
        <v-dialog class="w-50" v-model="dialogPrint">
          <v-card>
            <v-card>
              <v-btn
                location="top right"
                position="absolute"
                icon="mdi-close-circle"
                color="red"
                variant="text"
                size="x-large"
                class="mr-4 mt-2"
                @click="closeDialog()"
              ></v-btn>
              <div id="printContent">
                <v-container>
                  <div class="text-center">
                    <div class="text-header">Kantin Barokah</div>
                    <div class="text-subtitle">RS PKU Muhammadiyah Gamping</div>
                  </div>
                  <div class="text-left">
                    <div class="text-date">
                      {{ formattedDate(afterSubmit[0].tanggal) }}
                    </div>
                    <div class="text-id">No: {{ afterSubmit[0].id }}</div>
                  </div>
                  <hr class="dashed" />
                  <v-row class="nota-container-head">
                    <v-col cols="6" class="text-item-head-left"> Barang </v-col>
                    <v-col cols="6" class="text-item-head-right"> Total </v-col>
                  </v-row>
                  <v-row
                    class="nota-container"
                    v-for="item in totalItem"
                    :key="item.id_barang"
                  >
                    <v-col class="text-item-left">{{
                      item.barang + " x" + item.Jumlah
                    }}</v-col>
                    <v-col class="text-item-right">{{
                      formatCurrency(item.total_harga)
                    }}</v-col>
                  </v-row>
                  <hr class="dashed" />
                  <div class="text-total">
                    Total Harga:
                    {{ formatCurrency(afterSubmit[0].total_harga) }}
                  </div>
                </v-container>
              </div>
            </v-card>
            <v-card-action class="mx-auto my-4">
              <v-btn @click="print()" color="blue">Print</v-btn>
            </v-card-action>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </div>
    <!-- item list -->
    <div class="d-flex flex-column ga-2 pa-2" style="width: 50%">
      <v-text-field
        class="w-75 mx-auto"
        clearable
        variant="outlined"
        label="Cari Produk"
        density="compact"
        v-model="searchValue"
      ></v-text-field>
      <div
        class="overflow-auto h-100 justify-center"
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        "
      >
        <div
          v-for="item in filteredDataBarang"
          :key="item.id"
          class="d-flex flex-column justify-space-between ma-1 pa-2 bg-indigo rounded-lg"
          style="width: 150px; height: 100px; cursor: pointer"
          @click="tambahItem(item.id), scannerInputFocus()"
        >
          <div class="text-wrap text-body-1">{{ item.barang }}</div>
          <div class="text-right text-body-1 font-weight-bold">
            {{ formatCurrency(item.harga_jual) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useEnvStore } from "@/store/envStore";
import { useTimeStore } from "@/store/timeStore";
import { usePaperizer } from "paperizer";
import debounce from "lodash/debounce";
import axios from "axios";
import moment from "moment/min/moment-with-locales";
const { paperize } = usePaperizer("printContent", {
  features: ["fullscreen=no"],
  styles: ["/print.css"],
});
export default {
  data() {
    return {
      dialogPrint: false,
      loadingButton: false,
      selected: null,
      jumlah: 1,
      dataBarang: [],
      filteredDataBarang: [],
      totalItem: [],
      totalBayar: null,
      childDialogTambah: true,
      waktu: null,
      afterSubmit: [],
      searchValue: null,
      scannerValue: null,
    };
  },
  methods: {
    print() {
      paperize();
    },
    closeDialog() {
      this.dialogPrint = false;
      this.totalItem = [];
      this.totalBayar = null;
      setTimeout(() => {
        this.scannerInputFocus();
      }, 500);
    },
    getDataBarang() {
      axios
        .get(useEnvStore().apiUrl + "barangs/")
        .then((res) => {
          this.dataBarang = res.data.data;
          const sorter = (sortBy) => (a, b) =>
            a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;
          this.dataBarang = this.dataBarang.sort(sorter("barang"));
          this.filteredDataBarang = this.dataBarang;
          console.log(this.dataBarang);
        })

        .catch((err) => {
          console.log(err);
        });
    },
    tambahItem(id) {
      console.log(id);
      const selectedItem = this.dataBarang.find((item) => item.id === id);
      const existingItem = this.totalItem.find((item) => item.id === id);

      if (existingItem) {
        // Item already exists, increase jumlah
        existingItem.Jumlah += this.jumlah;
        existingItem.total_harga =
          existingItem.Jumlah * existingItem.harga_jual;
      } else {
        // Item doesn't exist, add new
        const itemBaru = {
          id: selectedItem.id,
          barang: selectedItem.barang,
          Jumlah: this.jumlah,
          harga_jual: selectedItem.harga_jual,
          harga_beli: selectedItem.harga_beli,
          total_harga: selectedItem.harga_jual * this.jumlah,
        };
        this.totalItem.push(itemBaru);
      }

      // Update total bayar
      this.totalBayar = this.totalItem.reduce(
        (total, obj) => total + obj.total_harga,
        0
      );
    },
    hapusItem(id) {
      const item = this.totalItem.find((obj) => obj.id === id);

      if (!item) return;
      // reduce item
      item.Jumlah -= 1;
      // if jumlah become 0, remove item
      if (item.Jumlah <= 0) {
        this.totalItem = this.totalItem.filter((obj) => obj.id !== id);
      } else {
        // recalculate total_harga if not removed
        item.total_harga = item.Jumlah * item.harga_jual;
      }

      // update total bayar
      this.totalBayar = this.totalItem.reduce(
        (total, obj) => total + obj.total_harga,
        0
      );
    },
    submitTransaksi() {
      this.waktu = useTimeStore().standarizedTime;
      const itemToPost = this.totalItem.map(({ id, ...rest }) => rest);
      let txdata = JSON.stringify({
        tanggal: this.waktu,
        items: itemToPost,
        total_harga: this.totalBayar,
      });
      axios
        .post(useEnvStore().apiUrl + "txs/", txdata, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          this.afterSubmit = res.data.data;
          this.loadingButton = false;
          this.dialogPrint = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formattedDate(value) {
      moment.locale("id");
      return moment(value).format("D MMMM YYYY [Jam] HH:mm:s");
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumSignificantDigits: 3,
      }).format(value);
    },
    scannerInputFocus() {
      this.$refs.scannerInput.focus();
    },
    handleScannerInput(value) {
      this.tambahItem(parseInt(value));
      this.scannerValue = null;
    },
  },
  watch: {
    searchValue(val) {
      console.log(val);
      if (val === null) {
        this.filteredDataBarang = this.dataBarang;
      } else {
        this.filteredDataBarang = this.dataBarang.filter((data) =>
          data.barang.toLowerCase().includes(val.toLowerCase())
        );
      }
    },
    scannerValue(newVal) {
      if (newVal === null) {
        return;
      } else {
        this.debouncedInput(newVal);
      }
    },
  },
  mounted() {
    this.getDataBarang();
    this.scannerInputFocus();
  },
  created() {
    this.debouncedInput = debounce(this.handleScannerInput, 500);
  },
};
</script>
<style scoped></style>
