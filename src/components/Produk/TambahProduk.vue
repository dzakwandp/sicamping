<template lang="">
    <div class="w-50 mx-auto">
            <v-card class="pa-12">
              <v-btn class="mt-4 mr-4" location="top right" position="absolute" variant="text" color="red" icon="mdi-close-circle" @click="closeDialog()"></v-btn>
                <v-card-title class="text-brown">
                    Tambah Produk
                </v-card-title>
            <v-text-field label="Nama Produk" v-model="barang" variant="outlined" color="brown" clearable class="mx-4" :rules=[rules.required]>
            </v-text-field>
            <CurrencyInput v-model="modal" label="Harga Modal"/>
            <CurrencyInput v-model="jual" label="Harga Jual"/>
            <v-btn class="mt-4" location="center" variant="flat" color="brown" @click="tambahBarang()">Tambah</v-btn>
        </v-card>
        
    </div>
</template>
<script>
import axios from 'axios';
import { useEnvStore } from '@/store/envStore';
import CurrencyInput from '../CurrencyInput.vue';
export default {
  components: { CurrencyInput },
  data() {
    return {
      barang: null,
      modal: 0,
      jual: 0,
      childDialogTambah: true,
      rules: {
        required: value => !!value || 'Wajib Diisi',
      },
    }
  },
  methods: {
    closeDialog() {
      this.childDialogTambah = false,
        this.$emit('update-state', this.childDialogTambah)
    },
    tambahBarang() {
      axios.post(useEnvStore().apiUrl + "barangs/", {
        barang: this.barang,
        harga_beli: this.modal,
        harga_jual: this.jual
      })
        .then((res) => {
          console.log(res),
            this, this.childDialogTambah = false,
            this.$emit('update-state', this.childDialogTambah)
          this.$emit('add-event')
          alert("Barang berhasil ditambahkan")
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },

}
</script>
<style lang="">
    
</style>