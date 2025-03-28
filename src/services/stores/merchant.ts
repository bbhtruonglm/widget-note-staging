import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMerchantStore = defineStore('merchant_store', () => {
  /** token merchant */
  const merchant_token = ref<string>('')

  /** id contact */
  const contact_id = ref<string>('')
  return {
    merchant_token,
    contact_id
  }
})
