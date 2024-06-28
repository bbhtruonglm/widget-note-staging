import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomerInfo } from 'bbh-chatbox-widget-js-sdk'
export const useCommonStore = defineStore('common_store', () => {
  /** toggle loading toàn trang */
  const is_loading_full_screen = ref<boolean>(false)
  /** dữ liệu khách hàng */
  const data_client = ref<CustomerInfo>({})
  /** avater của người dùng */
  function getUserAvatar() {
    return (
      'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar/' +
      data_client?.value?.public_profile?.fb_client_id +
      '?page_id=' +
      data_client?.value?.public_profile?.page_id +
      '&staff_id=' +
      data_client?.value?.public_profile?.current_staff_id +
      '&width=64&height=64'
    )
  }
  return {
    is_loading_full_screen,
    data_client,
    getUserAvatar,
  }
})
