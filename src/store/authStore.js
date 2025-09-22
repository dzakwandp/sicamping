import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth',{
    state:()=>({
        isLoggedIn: true,
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