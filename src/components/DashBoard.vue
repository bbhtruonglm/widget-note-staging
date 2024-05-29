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

<script lang="ts">
import debounce from "lodash/debounce";
import CreateNote from "./CreateNote.vue";
import NoteList from "./NoteList.vue";

export default {
  name: "DashBoard",
  components: {
    CreateNote,
    NoteList,
  },
  data() {
    return {
      handleChangeInput: () => {},
      // tabs: [
      //   {
      //     name: this.$t("appointment_scheduled"),
      //   },
      //   {
      //     name: this.$t("create_new"),
      //   },
      // ],
      input_content: "" as string,
      tab_selected: "NOTE_LIST",
      is_remind: false,
    };
  },
  created() {
    this.handleChangeInput = debounce(() => {
      if (this.input_content) return this.changeTab("CREATE_NEW");
      this.changeTab("NOTE_LIST");
    }, 500);
  },
  methods: {
    changeTab(tab: string) {
      this.tab_selected = tab;
    },
    handleKeyUp(event: any) {
      if (event.shiftKey && event.keyCode === 13) {
        // TODO đang tắt check ts chuyển sang composition API sẽ sửa
        // @ts-ignore
        this.$refs?.create_note?.create_new_note();
      }
    },
  },
};
</script>
