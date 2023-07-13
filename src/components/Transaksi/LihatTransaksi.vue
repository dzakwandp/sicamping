<template>
    <v-progress-circular class="mx-auto" v-if=loading color="teal" :size="128" :width="12"
        indeterminate></v-progress-circular>
    <v-card v-else class="h-screen mx-auto" width="800" prepend-icon="mdi-information" title="Detail Transaksi">
        <v-btn location="top right" position="absolute" icon="mdi-close-circle" color="red" variant="text" size="x-large"
            class="mr-4 mt-2" @click="closeDialog()"></v-btn>
        <div class="ml-10 mt-6 mb-6 w-50">
            <v-row>
                <v-col class="py-0">
                    Nomor Nota
                </v-col>
                <v-col class="py-0">
                    : {{ items.id }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0">
                    Tanggal
                </v-col>
                <v-col class="py-0">
                    : {{ formatDate(items.tanggal) }}
                </v-col>
            </v-row>
        </div>
        <v-card-text>
            <v-table>
                <thead>
                    <tr>
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
                    <tr v-for="item in items.items" :key="item.id_barang">
                        <td>{{ item.barang }}</td>
                        <td>{{ formatCurrency(item.harga_jual) }}</td>
                        <td>{{ item.jumlah }}</td>
                        <td>{{ formatCurrency(item.total_harga) }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="text-right">
            Total Harga: {{ formatCurrency(items.total_harga) }}
        </v-card-text>
    </v-card>
</template>
<script>
import { useEnvStore } from '@/store/envStore';
import moment from 'moment/min/moment-with-locales';
import axios from 'axios';
export default {
    props: ['viewItemId'],
    data() {
        return {
            items: [],
            loading: true,
            childDialogTrans: true,
        }
    },
    methods: {
        closeDialog() {
            this.childDialogTrans = false
            this.$emit('update-state', this.childDialogTrans)
        },
        getTransData() {
            axios.get(useEnvStore().apiUrl + "txs/" + this.viewItemId)
                .then((res) => {
                    this.items = res.data
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumSignificantDigits: 3
            }).format(value);
        },
        formatDate(date) {
            moment.locale('id')
            return moment(date).format('LLL')
        },
    },
    mounted() {
        this.getTransData()
    },
}
</script>
<style lang="">
    
</style>