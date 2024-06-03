<template>
  <div class="h-screen w-screen bg-slate-200">
    <div
      class="container h-full w-full md:w-[395px] md:h-[300px] text-sm px-3 py-2 flex flex-col gap-2 bg-white"
    >
      <input
        class="w-full min-h-14 border rounded-md pb-5 px-3 outline-none text-sm"
        v-model="appStore.note_content"
        @input="handleChangeInput"
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
//* import library
import debounce from 'lodash/debounce'
import { ref } from 'vue'
import { useAppStore } from '@/services/stores'

//* import components
import CreateNote from './CreateNote.vue'
import NoteList from './NoteList.vue'

// stores
const appStore = useAppStore()

/** ref tới component CreateNote */
const create_note = ref<any>(null)

/** hàm chuyển tab khi thay đổi nội dung ghi chú */
const handleChangeInput = debounce(() => {
  if (appStore.note_content) return
  // khi xóa hết nội dung ghi chú thi chuyển sang tab danh sách ghi chú
  changeTab('NOTE_LIST')
}, 500)

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
</script>
