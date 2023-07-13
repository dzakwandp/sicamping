import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth',{
    state:()=>({
        isLoggedIn: false,
        username:null
    }),
    actions:{
        login(response){
            this.isLoggedIn=true
            this.username=response.username
        },
        logout(){
            this.isLoggedIn=false
        }
    },
    persist: true
})