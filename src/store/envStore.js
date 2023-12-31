// Utilities
import { defineStore } from 'pinia'

export const useEnvStore = defineStore('env', {
  state: () => ({
    apiUrl: import.meta.env.VITE_API_URL
  }),
})
