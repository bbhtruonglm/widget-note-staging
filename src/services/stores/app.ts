import { INote } from '@/interface/note'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAppStore = defineStore('app_store', () => {
  /** loading toàn trang */
  const is_loading = ref<boolean>(false)
  /** nội dung ghi chú */
  const note_content = ref<string>('')
  /** tab đang được chọi*/
  const tab_selected = ref<'NOTE_LIST' | 'CREATE_NEW'>('NOTE_LIST')
  /** danh sách ghi chú */
  const note_list = ref<INote[]>([])
  /** index của note đang sửa */
  const note_index = ref<number>(-1) // bằng -1 là tạo mới
  /** tự động tạo đặt lịch từ chat AI */
  const is_auto_create = ref<boolean>(false)
  /** hàm kiểm tra có phải chế độ sửa ghi chú không */
  function isUpdateNote() {
    return note_index.value !== -1
  }

  /** hàm trả về note đang sửa */
  function selectedNote() {
    if (note_index.value === -1) return
    return note_list.value[note_index.value]
  }
  return {
    is_loading,
    note_content,
    tab_selected,
    note_list,
    note_index,
    is_auto_create,
    isUpdateNote,
    selectedNote,
  }
})
