/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import Paperizer from "paperizer";

// Composables
import { createApp } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import VueBarcode from "@chenfengyuan/vue-barcode";

// Plugins
import { registerPlugins } from "@/plugins";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const app = createApp(App);
app.component("vue-select", vSelect);
app.component("EasyDataTable", Vue3EasyDataTable);
app.component(VueBarcode.name, VueBarcode);

registerPlugins(app);

app.use(createPinia().use(piniaPluginPersistedState)).mount("#app");
app.use(VueSweetalert2);
app.use(Paperizer);
