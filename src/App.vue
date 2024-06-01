<template>
  <div id="app">
    <DashBoard v-if="!active_app" />
    <ActiveWidget v-if="active_app" />
  </div>
</template>

<script setup lang="ts">
import DashBoard from './components/DashBoard.vue'
import ActiveWidget from './components/ActiveWidget.vue'
import { Resful } from './services/resful'
import { onMounted, ref } from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'

let url_string = window.location.href
let url = new URL(url_string)
globalThis.access_token = url.searchParams.get('access_token')
// let secret_key = "0cf5516973a145929ff36d3303183e5f";
// let secret_key = "dc575a112fc24c35b6c289d0a83ab8e6";

/** hàm check active widget */
const active_app = ref(false)

onMounted(() => {
  activeApp()
})

/** hàm active widget */
async function activeApp() {
  let secret_key = globalThis.$env?.secret_key
  let client = await WIDGET.decodeClient()
  console.log(client)
  Resful.chatbox_post(
    'https://chatbox-app.botbanhang.vn/v1/service/partner-authenticate',
    {
      access_token: globalThis.access_token,
      secret_key,
    },
    (e: any) => {
      if (e) return (active_app.value = true)
      active_app.value = false
    }
  )
}
</script>

<style lang="scss">
#app {
  font-family: Arial;
}
</style>
