<template>
  <div class="h-screen w-screen bg-slate-200">
    <div
      class="container h-full w-full md:w-[395px] md:h-[300px] text-sm px-3 py-2 flex flex-col gap-2 bg-white"
    >
      <input
        class="w-full h-14 border rounded-md pb-5 px-3 outline-none text-sm"
        v-model="input_content"
        @input="handleChangeInput"
        :placeholder="'Tạo ghi chú mới...(Nhấn Shift + Enter để tạo nhanh)'"
        @keyup="handleKeyUp"
      />

      <!-- List tabs -->
      <NoteList v-if="tab_selected === 'NOTE_LIST'" />

      <!-- Create tabs -->
      <CreateNote
        ref="create_note"
        v-if="tab_selected === 'CREATE_NEW'"
        v-model:input_content="input_content"
        @changeTab="changeTab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//* import library
import debounce from "lodash/debounce";
import {ref} from "vue";
//* import components
import CreateNote from "./CreateNote.vue";
import NoteList from "./NoteList.vue";

/** Nội dung của ghi chú */
const input_content = ref<string>("");

/** Tab đang được hiển thị */
const tab_selected = ref<string>("NOTE_LIST");

const handleChangeInput = debounce(() => {
  if (input_content.value) return changeTab("CREATE_NEW");
  changeTab("NOTE_LIST");
}, 500);
function changeTab(tab: string) {
  tab_selected.value = tab;
}
function handleKeyUp(event: any) {
  if (event.shiftKey && event.keyCode === 13) {
    // TODO đang tắt check ts chuyển sang composition API sẽ sửa
    // @ts-ignore
    this.$refs?.create_note?.create_new_note();
  }
}
</script>
