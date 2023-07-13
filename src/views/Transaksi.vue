<template lang="">
    <v-container>
    <v-card variant="flat" color="lime-darken-2" density="comfortable" class="text-white">
      <v-card-title class="text-center text-h4 mt-4">Daftar Transaksi</v-card-title>
      <v-card-text class="text-center text-body-1">Di Sistem Kantin Barokah</v-card-text>
      <v-card-text class="text-right mt-n10">{{timeStore.formattedTime}}</v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <v-text-field class="w-50 ml-auto" v-model="searchValue" label="Cari Berdasarkan Nomor Nota" variant="outlined" density="compact"></v-text-field>
    <EasyDataTable :headers="headers" :items="items" theme-color="#AFB42B" table-class-name="custom-table" alternating :loading="loading" :search-field="searchField" :search-value="searchValue">
        <template #item-tanggal="item">
            {{formattedDate(item.tanggal)}}
        </template>
        <template #item-total_harga="item">
            {{formatCurrency(item.total_harga)}}
        </template>
        <template #item-operation="item">
            <v-dialog v-model="dialogView">
                <template v-slot:activator="{props}" v-slot:item.actions="{item}">
                    <v-btn class="text-body-2" prepend-icon="mdi-magnify-plus" variant="text" color="orange" v-bind="props" @click="viewPopUp(item.id)">Lihat</v-btn>
                </template>
            <LihatTrans :viewItemId="viewItemId" @update-state="updateDialogTrans"/>
        </v-dialog>
        </template>
    </EasyDataTable>
  </v-container>
</template>
<script>
import { useTimeStore } from '@/store/timeStore'
import { useEnvStore } from '@/store/envStore'
import LihatTrans from '@/components/Transaksi/LihatTransaksi.vue'
import axios from 'axios'
import moment from 'moment/min/moment-with-locales'
export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
        LihatTrans
    },
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
            headers: [
                { text: "NOMOR NOTA", value: "id" },
                { text: "TANGGAL", value: "tanggal" },
                { text: "TOTAL INVOICE", value: "total_harga" },
                { text: "LIHAT NOTA", value: "operation" },
            ],
            items: [],
            loading: true,
            dialogView: false,
            viewItemId: null,
            searchField: "id",
            searchValue: ""
        }
    },
    methods: {
        async getTransData() {
            try {
                const transData = await axios.get(useEnvStore().apiUrl + 'txs/')
                this.items = transData.data.data
                this.loading = false
            }
            catch (err) {
                console.log(err)
            }
        },
        updateDialogTrans(newState) {
            this.dialogView = newState
        },
        formattedDate(value) {
            moment.locale('id')
            return moment(value).format('D MMMM YYYY [Jam] HH:mm:s')
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumSignificantDigits: 3
            }).format(value);
        },
        viewPopUp(ItemId) {
            this.viewItemId = ItemId
        },
    },
    mounted() {
        this.getTransData()
    },
}
</script>
<style>
.custom-table {
    --easy-table-footer-font-size: 14px;
    --easy-table-body-row-font-size: 14px;
}
</style>