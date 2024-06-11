<template>
  <div class="h-screen w-screen bg-slate-200">
    <div
      class="container h-full w-full md:w-[395px] md:h-[300px] text-sm px-3 py-2 flex flex-col gap-2 bg-white"
    >
      <textarea
        class="w-full min-h-14 border rounded-md pt-2 pb-5 px-3 outline-none text-sm resize-none"
        v-model="appStore.note_content"
        :placeholder="'Tạo ghi chú mới...(Nhấn Shift + Enter để tạo nhanh)'"
        @keyup="handleKeyUp"
      />

      <!-- List tabs -->
      <NoteList v-if="appStore.tab_selected === 'NOTE_LIST'" />

      <!-- Create tabs -->
      <CreateNote
        ref="create_note"
        v-if="appStore.tab_selected === 'CREATE_NEW'"
        v-model:input_content="appStore.note_content"
        @changeTab="changeTab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { request } from '@/services/request'

//* import library
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/services/stores'
import WIDGET from 'bbh-chatbox-widget-js-sdk'

//* import components
import CreateNote from './CreateNote.vue'
import NoteList from './NoteList.vue'

// stores
const appStore = useAppStore()

/** ref tới component CreateNote */
const create_note = ref<InstanceType<typeof CreateNote>>()

//lấy danh sách khi nhận thông báo từ chatbox
WIDGET.onEvent(async () => {
  getNoteList()
})
onMounted(() => {
  //lấy danh sách khi bật app
  getNoteList()
})

/** hàm chuyển tab */
function changeTab(tab: 'NOTE_LIST' | 'CREATE_NEW') {
  appStore.tab_selected = tab
}

/** hàm bắt sự kiện gõ phím ở ô nhập nội dung ghi chứ */
function handleKeyUp(event: any) {
  // nếu có nội dung ghi chú thi chuyển sang tab tạo ghi chú
  if (appStore.note_content) changeTab('CREATE_NEW')

  // nếu không nhấn shift + enter thì không thực hiện gì
  if (!event.shiftKey || !(event.keyCode === 13)) return

  // nếu nhấn shift + enter và có nội dung ghi chứ thì tạo ghi chú
  if (!appStore.note_content) return

  // Sử dụng tham chiếu để gọi hàm createNewNote trong component con
  create_note.value?.createNewNote()
}

/** hàm lấy danh sách ghi chú */
async function getNoteList() {
  try {
    //bật loading
    appStore.is_loading = true

    // call api lấy danh sách ghi chú
    let result = await request({
      path: '/v1/note/read',
      body: {},
      method: 'POST',
      json: true,
    })

    //tắt loading
    appStore.is_loading = false

    //lưu danh sách ghi chú vào store
    appStore.note_list = result.data
  } catch (error) {
    console.log('get note list', error)
    //tắt loading
    appStore.is_loading = false
  }
}
</script>
