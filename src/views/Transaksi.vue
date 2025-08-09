<template lang="">
  <v-container>
    <v-card
      variant="flat"
      color="lime-darken-2"
      density="comfortable"
      class="text-white"
    >
      <v-card-title class="text-center text-h4 mt-4"
        >Daftar Transaksi</v-card-title
      >
      <v-card-text class="text-center text-body-1"
        >Di Sistem Kantin Barokah</v-card-text
      >
      <v-card-text class="text-right mt-n10">{{
        timeStore.formattedTime
      }}</v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          v-if="showDel === false"
          class="text-body-2"
          @click="dialogPass = true"
          prepend-icon="mdi-key-alert"
          color="red"
        >
          Aktifkan Mode Hapus
          <v-dialog v-model="dialogPass">
            <v-card class="w-25 mx-auto pa-4">
              <v-btn
                class="ml-auto mb-4"
                size="x-small"
                icon="mdi-close"
                color="red"
                @click="dialogPass = false"
              ></v-btn>
              <v-text-field
                v-model="inputtedPass"
                label="Masukkan Password"
                variant="outlined"
                density="compact"
                :type="showPass ? 'text' : 'password'"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPass = !showPass"
              ></v-text-field>
              <div class="text-caption text-red mt-n4">{{ passErrMess }}</div>
              <v-card-action class="mx-auto">
                <v-btn class="text-body-2" color="red" @click="activateDelete()"
                  >Aktifkan</v-btn
                >
              </v-card-action>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn
          v-if="showDel === true"
          class="text-body-2"
          color="blue"
          prepend-icon="mdi-lock-check"
          @click="showDel = false"
          >Nonaktifkan Mode Hapus</v-btn
        >
      </v-col>
      <v-col>
        <v-text-field
          class="w-75 ml-auto"
          v-model="searchValue"
          label="Cari Berdasarkan Nomor Nota"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>
    </v-row>
    <EasyDataTable
      :headers="headers"
      :items="items"
      theme-color="#AFB42B"
      table-class-name="custom-table"
      alternating
      :loading="loading"
      :search-field="searchField"
      :search-value="searchValue"
    >
      <template #item-tanggal="item">
        {{ formattedDate(item.tanggal) }}
      </template>
      <template #item-total_harga="item">
        {{ formatCurrency(item.total_harga) }}
      </template>
      <template #item-operation="item">
        <!-- dialog view -->
        <v-dialog v-model="dialogView">
          <template v-slot:activator="{ props }" v-slot:item.actions="{ item }">
            <v-btn
              class="text-body-2"
              prepend-icon="mdi-magnify-plus"
              variant="text"
              color="orange"
              v-bind="props"
              @click="viewPopUp(item.id)"
              >Lihat</v-btn
            >
          </template>
          <LihatTrans
            :viewItemId="viewItemId"
            @update-state="updateDialogTrans"
          />
        </v-dialog>
        <!-- dialog hapus -->
        <v-dialog v-if="showDel" v-model="dialogDel">
          <template v-slot:activator="{ props }" v-slot:item.actions="{ item }">
            <v-btn
              class="text-body-2"
              prepend-icon="mdi-delete"
              variant="text"
              color="red"
              v-bind="props"
              @click="deleteId = item.id"
              >Hapus</v-btn
            >
          </template>
          <v-card class="w-50 mx-auto text-center">
            <v-card-text
              >Apakah anda yakin menghapus transaksi ini?</v-card-text
            >
            <v-card-action class="my-4">
              <v-btn
                color="blue"
                @click="(delButton = true), deleteTrans()"
                :loading="delButton"
                >Ya</v-btn
              >
              <v-btn class="ml-16" color="red" @click="dialogDel = false"
                >Tidak</v-btn
              >
            </v-card-action>
          </v-card>
        </v-dialog>
      </template>
    </EasyDataTable>
  </v-container>
</template>
<script>
import { useTimeStore } from "@/store/timeStore";
import { useEnvStore } from "@/store/envStore";
import LihatTrans from "@/components/Transaksi/LihatTransaksi.vue";
import axios from "axios";
import moment from "moment/min/moment-with-locales";
export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
    LihatTrans,
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
        { text: "NOMOR NOTA", value: "id" },
        { text: "TANGGAL", value: "tanggal" },
        { text: "TOTAL INVOICE", value: "total_harga" },
        { text: "", value: "operation" },
      ],
      items: [],
      loading: true,
      showPass: false,
      inputtedPass: "",
      pass: "bismillahhapus",
      passErrMess: "",
      dialogPass: false,
      dialogView: false,
      showDel: false,
      dialogDel: false,
      deleteId: false,
      delButton: false,
      viewItemId: null,
      searchField: "id",
      searchValue: "",
    };
  },
  methods: {
    async getTransData() {
      try {
        const transData = await axios.get(useEnvStore().apiUrl + "txs/");
        this.items = transData.data.data.reverse();
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    updateDialogTrans(newState) {
      this.dialogView = newState;
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
    viewPopUp(ItemId) {
      this.viewItemId = ItemId;
    },
    activateDelete() {
      if (this.inputtedPass === this.pass) {
        this.showDel = true;
        this.dialogPass = false;
        this.inputtedPass = "";
        this.passErrMess = "";
      } else {
        this.passErrMess = "Password salah!";
      }
    },
    deleteTrans() {
      axios
        .delete(useEnvStore().apiUrl + "txs/" + this.deleteId)
        .then((res) => {
          console.log(res);
          window.alert("Transaksi berhasil dihapus");
          this.dialogDel = false;
          this.delButton = false;
          this.getTransData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getTransData();
  },
};
</script>
<style>
.custom-table {
  --easy-table-footer-font-size: 14px;
  --easy-table-body-row-font-size: 14px;
}
</style>
