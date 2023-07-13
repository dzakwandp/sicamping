import {defineStore} from 'pinia'
import moment from 'moment'

export const useTimeStore = defineStore('time', {
    state:()=>({
        currentTime: moment()
    }),
    actions:{
        updateTime(){
            this.currentTime = moment()
        }
    },
    getters:{
        formattedTime(){
            return this.currentTime.format('D MMMM YYYY, H:mm:ss')
        },
        standarizedTime(){
            return this.currentTime.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        }
    }
})