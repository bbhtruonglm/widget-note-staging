<template>
  <div class="active-body flex items-center justify-center h-screen">
    <div
      @click="active()"
      class="w-fit h-12 bg-orange-600 text-white flex items-center justify-center rounded-md px-5 cursor-pointer"
    >
      Kích hoạt
    </div>
  </div>
</template>

<script setup lang="ts">
//* import library
import WIDGET from 'bbh-chatbox-widget-js-sdk'

/** hàm oauth widget */
async function active() {
  try {
    // call API oauth
    await WIDGET.oAuth()
    // thông báo kích hoạt thành công
    alert('Kích hoạt thành công')
  } catch (error) {
    // thông báo kích hoạt không thành công
    alert('Kích hoạt không thành công thành công')
    console.log('oauth widget', error)
  }
  // tắt cửa sổ kích hoạt
  window.close()
}
</script>

<style scoped lang="scss"></style>
