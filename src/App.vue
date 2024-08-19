<template>
  <div id="app">
    <DashBoard v-if="!active_app" />
    <ActiveWidget v-if="active_app" />
    <Loading type="FULL" v-if="appStore.is_loading" />
  </div>
</template>

<script setup lang="ts">
// * import function
import { useAppStore, useCommonStore } from './services/stores'
import { Toast } from '@/services/toast'
import { queryString, checkDate } from './services/helper'

// * import library
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { onMounted, ref } from 'vue'

// * import component
import DashBoard from './components/DashBoard.vue'
import ActiveWidget from './components/ActiveWidget.vue'
import Loading from './components/Loading.vue'

// let url_string = window.location.href
// let url = new URL(url_string)
// globalThis.access_token = url.searchParams.get('access_token')

// * store
const appStore = useAppStore()
const commonStore = useCommonStore()

// * khởi tạo hàm thông báo
const $toast = new Toast()

/** hàm check active widget */
const active_app = ref<boolean>(false)

onMounted(() => {
  // hàm kiểm tra xem đã kích hoạt chưa và chuyển đến màn tương ứng
  activeApp()
  // lắng nghe event từ merchant khi chuyển đoạn chat
  WIDGET.onEvent(() => {
    // ghi lại thông tin khách hàng mới
    getDataClient()
  })
  autoCreate()
})

/** hàm tự động tạo ghi chú */
function autoCreate(){
  let note_content = queryString('note')
  let date_create = queryString('datetime')
  if(!note_content && !date_create) return

  /** hợp lệ của thời gian */
  let is_date_valid = date_create && checkDate(date_create)

  if(!is_date_valid){
    $toast.warning('Thời gian hiện tại đã có thời gian mà bạn hẹn lịch')
  }

  if (note_content || is_date_valid) {
    //chuyển màn tạo ghi chú
    appStore.tab_selected = 'CREATE_NEW'
    appStore.is_auto_create = true
  }
}

/** hàm lấy thông tin khách hàng */
async function getDataClient() {
  try {
    //bật loading
    commonStore.is_loading_full_screen = true

    // lấy thông tin khách hàng
    commonStore.data_client = await WIDGET.decodeClient()

    //tắt loading
    commonStore.is_loading_full_screen = false
  } catch (error) {
    console.log('getDataClient', error)
    //tắt loading
    commonStore.is_loading_full_screen = false
  }
}

/** hàm active widget */
async function activeApp() {
  try {
    //bật loading
    commonStore.is_loading_full_screen = true

    /** lấy thông tin của khách hàng */
    commonStore.data_client = await WIDGET.decodeClient()

    //nếu thành công thì không cho vào màn kích hoạt
    active_app.value = false

    //tắt loading
    commonStore.is_loading_full_screen = false
  } catch (error) {
    console.log('activeApp', error)

    // thông báo nếu scret key sai
    if (error === 'WRONG_SECRET_KEY') {
      $toast.error(
        'Secret key của ghi chú sai, vui lòng liên hệ với kỹ thuật viên'
      )
    }

    // nếu không lấy thành công thì chuyển sang màn kích hoạt
    active_app.value = true

    //tắt loading
    commonStore.is_loading_full_screen = false
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial;
}
</style>
