<script setup lang="ts">
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';

const props = defineProps({ modelValue: Number });

const rules = [
    (v: string) => !!v || 'Harga wajib diisi!',
];

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
    "locale": "de-DE",
    "currency": "EUR",
    "currencyDisplay": "hidden",
    "hideCurrencySymbolOnFocus": true,
    "hideGroupingSeparatorOnFocus": true,
    "hideNegligibleDecimalDigitsOnFocus": true,
    "autoDecimalDigits": false,
    "useGrouping": true,
    "accountingSign": false
});

watch(
    () => props.modelValue,
    (value) => {
        setValue(value);
    }
);
</script>

<template>
    <VTextField v-model="formattedValue" prefix="Rp" variant="outlined" color="brown" class="mx-4 my-4"
        hint="Masukkan harga jual dari produk ini" ref="inputRef" :rules="rules">
    </VTextField>
</template>
