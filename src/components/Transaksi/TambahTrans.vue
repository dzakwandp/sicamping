<template>
    <v-card class="h-screen" width="800" prepend-icon="mdi-note-plus-outline" title="Tambah Transaksi">
        <v-btn location="top right" position="absolute" icon="mdi-close-circle" color="red" variant="text" size="x-large"
            class="mr-4 mt-2" @click="closeDialog()"></v-btn>
        <v-text class="px-8 py-2 d-flex flex-row">
            <v-select class="w-50 mr-4" variant="outlined" v-model="selected" :items="dataBarang" item-title="barang"
                label="Pilih Barang" return-object>
            </v-select>
            <v-text-field class="w-50 mx-4" v-model.number="jumlah" type="number" label="Jumlah"
                variant="outlined"></v-text-field>
            <v-btn class="align-self-center" variant="outlined" @click="tambahItem">Tambahkan</v-btn>
        </v-text>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                        Index
                    </th>
                    <th class="text-left">
                        Barang
                    </th>
                    <th class="text-left">
                        Harga (pcs)
                    </th>
                    <th class="text-left">
                        Jumlah
                    </th>
                    <th class="text-left">
                        Total
                    </th>
                    <th class="text-left">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in totalItem" :key="item.id_barang">
                    <td>{{ item.index }}</td>
                    <td>{{ item.barang }}</td>
                    <td>{{ formatCurrency(item.harga_jual) }}</td>
                    <td>{{ item.Jumlah }}</td>
                    <td>{{ formatCurrency(item.total_harga) }}</td>
                    <td><v-btn variant="text" icon="mdi-delete" color="red" @click="hapusItem(item.index)"></v-btn></td>
                </tr>
            </tbody>
        </v-table>
        <v-divider></v-divider>
        <v-card-text class="text-right">
            Total Harga: {{ formatCurrency(totalBayar) }}
        </v-card-text>
        <v-card-actions>
            <v-btn @click="submitTransaksi(), loadingButton = true" :loading="loadingButton" location="center"
                variant="outlined" color="blue-darken-4">Konfirmasi</v-btn>
            <v-dialog class="w-50" v-model="dialogPrint">
                <v-card>
                    <v-card>
                        <v-btn location="top right" position="absolute" icon="mdi-close-circle" color="red" variant="text"
                            size="x-large" class="mr-4 mt-2" @click="closeDialog()"></v-btn>
                        <div id="printContent">
                            <v-container>
                                <div class="text-center">
                                    <div class="text-header">Kantin Barokah</div>
                                    <div class="text-subtitle">RS PKU Muhammadiyah Gamping</div>
                                </div>
                                <div class="text-left">
                                    <div class="text-date">{{ formattedDate(afterSubmit[0].tanggal) }}</div>
                                    <div class="text-id">No: {{ afterSubmit[0].id }}</div>
                                </div>
                                <hr class="dashed">
                                <v-row class="nota-container-head">
                                    <v-col cols="6" class="text-item-head-left">
                                        Barang
                                    </v-col>
                                    <v-col cols="6" class="text-item-head-right">
                                        Total
                                    </v-col>
                                </v-row>
                                <v-row class="nota-container" v-for="item in totalItem" :key="item.id_barang">
                                    <v-col class="text-item-left">{{ item.barang + " x" + item.Jumlah }}</v-col>
                                    <v-col class="text-item-right">{{ formatCurrency(item.total_harga) }}</v-col>
                                </v-row>
                                <hr class="dashed">
                                <div class="text-total">Total Harga: {{ formatCurrency(afterSubmit[0].total_harga) }}
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
    </v-card>
</template>
<script>
import { useEnvStore } from '@/store/envStore'
import { useTimeStore } from '@/store/timeStore'
import { usePaperizer } from 'paperizer'
import axios from 'axios'
import moment from 'moment/min/moment-with-locales'
const { paperize } = usePaperizer('printContent', {
    features: [
        'fullscreen=no'
    ],
    styles: [
        '/print.css'
    ]
})
export default {
    data() {
        return {
            dialogPrint: false,
            loadingButton: false,
            selected: null,
            jumlah: null,
            dataBarang: [],
            totalItem: [],
            totalBayar: null,
            childDialogTambah: true,
            waktu: null,
            afterSubmit: []
        }
    },
    methods: {
        print() {
            paperize()
        },
        closeDialog() {
            this.childDialogTambah = false
            this.$emit('update-dialog-state', this.childDialogTambah)
        },
        getDataBarang() {
            axios.get(useEnvStore().apiUrl + "barangs/")
                .then((res) => {
                    this.dataBarang = res.data.data
                    console.log(this.dataBarang)
                })

                .catch((err) => {
                    console.log(err)
                })
        },
        tambahItem() {
            const itemBaru = {
                barang: this.selected.barang,
                Jumlah: this.jumlah,
                harga_jual: this.selected.harga_jual,
                harga_beli: this.selected.harga_beli,
                total_harga: this.selected.harga_jual * this.jumlah
            }
            this.totalItem.push(itemBaru)
            const createIndex = this.totalItem.map((obj, index) => ({ ...obj, index: index + 1 }))
            this.totalItem = createIndex
            this.jumlah = null

            const total_bayar = this.totalItem.reduce((total, obj) => total + obj.total_harga, 0)
            this.totalBayar = total_bayar
        },
        hapusItem(index) {
            const indexToRemove = index
            const removedIndex = this.totalItem.filter(obj => obj.index !== indexToRemove)
            this.totalItem = removedIndex

            const total_bayar = this.totalItem.reduce((total, obj) => total + obj.total_harga, 0)
            this.totalBayar = total_bayar
        },
        submitTransaksi() {
            this.waktu = useTimeStore().standarizedTime
            const itemToPost = this.totalItem.map(({ index, ...rest }) => rest)
            let txdata = JSON.stringify({
                tanggal: this.waktu,
                items: itemToPost,
                total_harga: this.totalBayar
            })
            axios.post(useEnvStore().apiUrl + "txs/", txdata,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then((res) => {
                    this.afterSubmit = res.data.data
                    this.loadingButton = false
                    this.dialogPrint = true
                })
                .catch((err) => {
                    console.log(err)
                })
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
        }
    },
    mounted() {
        this.getDataBarang()
    },
}
</script>
<style></style>