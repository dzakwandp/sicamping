<template lang="">
    <div class="w-50 mx-auto">
        <div class="text-center">
        <v-progress-circular v-if=loading color="teal" :size="128" :width="12" indeterminate></v-progress-circular>
            <v-card v-else class="pa-12">
              <v-btn class="mt-4 mr-4" location="top right" position="absolute" variant="text" color="red" icon="mdi-close-circle" @click="closeDialogEdit()"></v-btn>
                <v-card-title class="text-orange">
                    Ubah Produk
                </v-card-title>
            <v-text-field label="Nama Produk" v-model="barang" variant="outlined" color="brown" clearable class="mx-4" :rules=[rules.required]>
            </v-text-field>
            <CurrencyInput v-model="modal"/>
            <CurrencyInput v-model="jual"/>
            <v-btn class="mt-4 text-white" location="center" variant="flat" color="orange" @click="editBarang()">Ubah</v-btn>
        </v-card>
    </div>
    </div>
</template>
<script>
import axios from 'axios';
import { useEnvStore } from '@/store/envStore';
import CurrencyInput from '../CurrencyInput.vue';
export default {
    components: { CurrencyInput },
    props: ['editItemId'],
    data() {
        return {
            barang: null,
            modal: 0,
            jual: 0,
            dataBarang: [],
            childDialogEdit: true,
            loading: true,
            rules: {
                required: value => !!value || 'Wajib Diisi',
            },
        }
    },
    methods: {
        closeDialogEdit() {
            this.childDialogEdit = false,
                this.$emit('update-state-edit', this.childDialogEdit)
        },
        editBarang() {
            axios.put(useEnvStore().apiUrl + "barangs/" + this.editItemId, {
                barang: this.barang,
                harga_beli: this.modal,
                harga_jual: this.jual
            })
                .then((res) => {
                    console.log(res),
                        this, this.childDialogEdit = false,
                        this.$emit('update-state-edit', this.childDialogEdit)
                    this.$emit('add-event')
                    alert("Barang berhasil diubah")
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        loadData() {
            axios.get(useEnvStore().apiUrl + "barangs/" + this.editItemId)
                .then((res) => {
                    this.dataBarang = res.data
                    console.log(this.dataBarang)
                    this.barang = this.dataBarang.barang
                    this.modal = this.dataBarang.harga_beli
                    this.jual = this.dataBarang.harga_jual
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    },
    async mounted() {
        try {
            this.loadData()
        }
        catch (err) {
            console.log(err)
        }
    },

}
</script>
<style lang="">
    
</style>