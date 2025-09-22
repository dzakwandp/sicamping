<template>
  <v-app>
    <v-main>
      <div class="d-flex h-screen align-center justify-center">
        <div class="d-flex flex-column text-grey-darken-2">
          <div class="text-h4">Si Camping</div>
          <div class="text-caption">
            Sistem Canteen RS PKU Muhammadiyah Gamping
          </div>
          <v-sheet width="350" class="mx-auto mt-8 text-teal-darken-2">
            <v-form>
              <v-text-field
                clearable
                label="username"
                variant="outlined"
                prepend-inner-icon="mdi-account-circle"
                v-model="username"
              ></v-text-field>
            </v-form>
            <v-form>
              <v-text-field
                label="password"
                variant="outlined"
                prepend-inner-icon="mdi-shield-key"
                v-model="password"
                :append-inner-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showpass ? 'text' : 'password'"
                @keydown.enter.prevent="onLoading(), onLogin()"
                @click:append-inner="showpass = !showpass"
              ></v-text-field>
            </v-form>
          </v-sheet>
          <v-btn
            @click="onLoading(), onLogin()"
            class="text-body-1"
            color="teal"
            >Login</v-btn
          >
          <small v-text="errormsg" class="text-red"></small>
          <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        </div>
      </div>
    </v-main>
  </v-app>
  <v-layout>
    <v-footer class="mt-n10 text-body-2 justify-center text-grey-darken-2"
      >&#169; Kantin Barokah 2023</v-footer
    >
  </v-layout>
</template>
<script>
import axios from "axios";
import { useEnvStore } from "@/store/envStore";
import { useAuthStore } from "@/store/authStore";
export default {
  data() {
    return {
      showpass: false,
      username: "",
      password: "",
      loading: false,
      errormsg: "",
    };
  },
  methods: {
    onLoading() {
      this.loading = true;
    },
    async onLogin() {
      try {
        const auth = { username: this.username, password: this.password };
        const response = await axios.post(
          useEnvStore().apiUrl + "login/",
          auth
        );
        console.log(response.data.data);
        useAuthStore().login(response.data.data);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.loading = false;
        this.errormsg = "Username atau Password salah";
      }
    },
  },
};
</script>
<style lang=""></style>
