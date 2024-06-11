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
// * import library
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { onMounted, ref } from 'vue'
// * import component
import DashBoard from './components/DashBoard.vue'
import ActiveWidget from './components/ActiveWidget.vue'
import Loading from './components/Loading.vue'

let url_string = window.location.href
let url = new URL(url_string)
globalThis.access_token = url.searchParams.get('access_token')

/** hàm check active widget */
const active_app = ref<boolean>(false)

// * store
const appStore = useAppStore()
const commonStore = useCommonStore()

onMounted(async () => {
  // hàm kiểm tra xem đã kích hoạt chưa và chuyển đến màn tương ứng
  activeApp()
  // lắng nghe event từ merchant khi chuyển đoạn chat
  WIDGET.onEvent(async () => {
    // ghi lại thông tin khách hàng mới
    commonStore.data_client = await WIDGET.decodeClient()
    console.log('commonStore.data_client', commonStore.data_client)
  })
})

/** hàm active widget */
async function activeApp() {
  try {
    /** lấy thông tin của khách hàng */
    commonStore.data_client = await WIDGET.decodeClient()
    //nếu thành công thì không cho vào màn kích hoạt
    active_app.value = false
  } catch (error) {
    console.log('activeApp', error)
    // nếu không lấy thành công thì chuyển sang màn kích hoạt
    active_app.value = true
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial;
}
</style>
