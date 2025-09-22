<template lang="">
  <v-container>
    <v-card
      variant="flat"
      color="brown"
      density="comfortable"
      class="card-border"
    >
      <v-card-title class="text-center text-h4 mt-4"
        >Daftar Produk</v-card-title
      >
      <v-card-text class="text-center text-body-1"
        >Di Sistem Kantin Barokah</v-card-text
      >
      <v-card-text class="text-right mt-n10">{{
        timeStore.formattedTime
      }}</v-card-text>
    </v-card>
  </v-container>
  <!-- Dialog Tambah Produk -->
  <v-dialog v-model="dialogTambah" class="h-screen">
    <template v-slot:activator="{ props }">
      <v-btn
        prepend-icon="mdi-plus"
        elevation="8"
        class="ml-12 mb-4 text-body-1"
        color="brown"
        v-bind="props"
        >Tambah Produk</v-btn
      >
    </template>
    <TambahProduk
      @update-state="updateDialogTambah"
      @add-event="getTableData"
    />
  </v-dialog>
  <!-- print all barcode -->
  <v-btn
    elevation="8"
    class="ml-6 mb-4 text-body-1"
    color="grey"
    prepend-icon="mdi-barcode"
    @click="printAll()"
    >Cetak Semua Barcode</v-btn
  >
  <!-- Search data pada table -->
  <v-text-field
    class="w-50 ml-auto pl-10 mx-12 mt-n14"
    v-model="search_value"
    label="Cari Disini"
    variant="outlined"
    density="compact"
  ></v-text-field>
  <!-- Data Table Produk -->
  <EasyDataTable
    show-index
    class="mx-12 text-body-1"
    :headers="headers"
    :items="items"
    theme-color="#795548"
    table-class-name="custom-table"
    alternating
    buttons-pagination
    :loading="loading"
    :search-field="search_field"
    :search-value="search_value"
  >
    <template #item-harga_beli="item">
      {{ formatCurrency(item.harga_beli) }}
    </template>
    <template #item-harga_jual="item">
      {{ formatCurrency(item.harga_jual) }}
    </template>
    <template #item-operation="item">
      <!-- Dialog Edit -->
      <v-dialog v-model="dialogEdit">
        <template v-slot:activator="{ props }" v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-file-edit"
            variant="text"
            color="orange"
            v-bind="props"
            @click="editPopUp(item.id)"
          ></v-btn>
        </template>
        <EditProduk
          :editItemId="editItemId"
          @update-state-edit="updateDialogEdit"
          @add-event="getTableData"
        />
      </v-dialog>
      <!-- Dialog Hapus Produk -->
      <v-dialog v-model="dialogHapus" width="auto">
        <template v-slot:activator="{ props }" v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="red"
            v-bind="props"
            @click="deletePopUp(item.id)"
          ></v-btn>
        </template>
        <v-card>
          <v-card-text>
            Apakah anda yakin akan menghapus barang ini?
          </v-card-text>
          <v-card-text class="mt-8">
            <v-btn
              @click="deleteItem"
              class="mb-2 ml-6"
              color="red"
              variant="outlined"
              position="absolute"
              location="bottom left"
              >Ya</v-btn
            >
            <v-btn
              @click="dialogHapus = false"
              class="mb-2 mr-6"
              variant="outlined"
              color="blue"
              position="absolute"
              location="bottom right"
              >Tidak</v-btn
            >
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-btn @click="(printedItem = item), print()" color="grey"
        >Cetak Barcode</v-btn
      >
      <div class="d-none" id="printContent">
        <span v-if="printedItem !== null" class="text-item-left">
          {{ printedItem.barang }}
        </span>
        <vue-barcode
          v-if="printedItem !== null"
          :value="printedItem.id.toString()"
          tag="svg"
        ></vue-barcode>
      </div>
    </template>
  </EasyDataTable>
  <div class="d-none" id="printContentAll">
    <div class="barcode-container">
      <div v-for="item in items" :key="item.index" class="barcode-items">
        <span class="text-item-left">
          {{ item.barang }}
        </span>
        <vue-barcode :value="item.id.toString()" tag="svg"></vue-barcode>
      </div>
    </div>
  </div>
</template>
<script>
import TambahProduk from "@/components/Produk/TambahProduk.vue";
import EditProduk from "@/components/Produk/EditProduk.vue";

import { useEnvStore } from "@/store/envStore";
import { useTimeStore } from "@/store/timeStore";
import axios from "axios";
export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
    TambahProduk,
    EditProduk,
  },
  setup() {
    const timeStore = useTimeStore();

    setInterval(() => {
      timeStore.updateTime();
    }, 1000);

    // **only return the whole store** instead of destructuring
    return { timeStore };
  },
  data: () => ({
    headers: [
      { text: "BARANG", value: "barang" },
      { text: "HARGA MODAL", value: "harga_beli" },
      { text: "HARGA JUAL", value: "harga_jual" },
      { text: "", value: "operation" },
    ],
    items: [],
    dialogTambah: false,
    dialogHapus: false,
    dialogEdit: false,
    deleteItemId: null,
    editItemId: null,
    loading: true,
    search_field: "barang",
    search_value: "",
    printedItem: null,
  }),
  methods: {
    print() {
      setTimeout(() => {
        this.$paperize("printContent", {
          features: ["fullscreen=no"],
          styles: ["/barcode.css"],
        });
      }, 500);
    },
    printAll() {
      setTimeout(() => {
        this.$paperize("printContentAll", {
          features: ["fullscreen=no"],
          styles: ["/barcodeAll.css"],
        });
      }, 500);
    },
    updateDialogTambah(newState) {
      this.dialogTambah = newState;
    },
    updateDialogEdit(newState) {
      this.dialogEdit = newState;
    },
    deletePopUp(ItemId) {
      this.deleteItemId = ItemId;
    },
    editPopUp(ItemId) {
      this.editItemId = ItemId;
    },
    deleteItem() {
      axios
        .delete(useEnvStore().apiUrl + "barangs/" + this.deleteItemId)
        .then((res) => {
          console.log(res);
          this.dialogHapus = false;
          alert("Barang berhasil dihapus");
          this.loading = true;
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getTableData() {
      try {
        const dataProduk = await axios.get(useEnvStore().apiUrl + "barangs/");
        this.items = dataProduk.data.data;
        console.log(this.items);
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
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang=""></style>

<style>
.card-border {
  border-width: 3px;
}

.custom-table {
  --easy-table-footer-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>
