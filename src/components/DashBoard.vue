<template>
  <div class="h-screen w-screen bg-slate-200">
    <div
      class="container h-full w-full md:w-[395px] md:h-[300px] text-sm px-3 py-2 flex flex-col gap-2 bg-white"
    >
      <div class="min-h-14 h-14 relative w-full">
        <textarea
          id="content_note"
          class="w-full h-full border rounded-md py-1.5 pl-3 pr-9 outline-none text-sm resize-none placeholder:text-slate-400"
          v-model="appStore.note_content"
          :placeholder="`Tạo ghi chú mới đến ${commonStore.data_client?.public_profile?.client_name}`"
          @keyup="handleKeyUp"
        />
        <label
          v-if="!appStore.note_content"
          class="absolute bottom-0 left-0 text-slate-400 px-3.5 py-1.5 -z-1"
          for="content_note"
        >
          ( Nhấn Shift + Enter để tạo nhanh )
        </label>
        <img
          :src="commonStore.getUserAvatar()"
          class="w-6 h-6 absolute top-1 right-1 rounded-md"
        />
      </div>
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
import { useAppStore, useCommonStore } from '@/services/stores'
import WIDGET from 'bbh-chatbox-widget-js-sdk'

//* import components
import CreateNote from '@/components/CreateNote.vue'
import NoteList from '@/components/NoteList.vue'

// stores
const appStore = useAppStore()
const commonStore = useCommonStore()

/** ref tới component CreateNote */
const create_note = ref<any>(null)

//lấy danh sách khi nhận thông báo từ chatbox
WIDGET.onEvent(async () => {
  getNoteList()
})
onMounted(() => {
  //lấy danh sách khi bật app
  getNoteList()
})

/** hàm chuyển tab */
function changeTab(tab: string) {
  appStore.tab_selected = tab
}

/** hàm bắt sự kiện nhấn shift + enter để tạo ghi chứ */
function handleKeyUp(event: any) {
  // nếu có nội dung ghi chú thi chuyển sang tab tạo ghi chú
  if (appStore.note_content) changeTab('CREATE_NEW')
  // nếu khong shift + enter thi khong thuc hành
  if (!event.shiftKey || !(event.keyCode === 13)) return

  // nếu shift + enter và có nội dung ghi chứ thì tạo ghi chú
  if (!appStore.note_content) return

  // Sử dụng tham chiếu để gọi hàm createNewNote trong component con
  create_note.value.createNewNote()
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

    appStore.note_list = result.data
  } catch (error) {
    console.log('get note list', error)
    //tắt loading
    appStore.is_loading = false
  }
}
</script>
