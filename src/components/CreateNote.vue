<template>
  <div class="text-sm flex flex-col gap-2.5">
    <div class="flex gap-2 justify-end cursor-pointer">
      <div class="flex gap-2 w-fit" @click="toogleRemind()">
        <input
          type="checkbox"
          class="accent-black scale-125 cursor-pointer"
          v-model="is_remind"
        />
        <p class="text-black font-medium">Nhắc lịch</p>
      </div>
    </div>
    <div
      class="select-calendar grid grid-cols-2 gap-2 text-gray-500"
      v-if="is_remind"
    >
      <div class="col-span-1 flex flex-col gap-1">
        <label class="text-xs">
          Chọn thời gian
          <span class="text-red-500">*</span>
        </label>
        <CustomDatepicker
          v-model:date="date_value"
          v-model:time="time_value"
          :frequency_selected="frequency_selected"
        />
      </div>
      <div class="col-span-1 flex flex-col gap-1">
        <label class="text-xs">{{ $t('frequency') }}</label>
        <select
          v-model="frequency_selected"
          class="border px-2.5 rounded outline-none h-full bg-white"
        >
          <option
            v-for="(item, index) in FREQUENCY"
            :key="index"
            :value="item.label"
            class="text-black"
          >
            {{ $t(item.value) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Button  -->
    <div class="w-full flex gap-2 items-center text-black font-medium">
      <!-- @click="toogle_modal()" -->
      <div
        class="w-1/4 text-center cursor-pointer hover:font-bold"
        @click="closeCreate()"
      >
        {{ $t('close') }}
      </div>
      <div
        class="w-3/4 text-center text-white py-2 rounded-md cursor-pointer hover:shadow-md hover:shadow-black/20"
        :class="props.input_content ? 'bg-orange-600' : 'bg-gray-400'"
        @click="createNewNote()"
      >
        {{ appStore.isUpdateNote() ? $t('update') : $t('save') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { useAppStore, useCommonStore } from '@/services/stores'
import { request } from '@/services/request'

// * import library
import { ref } from 'vue'
import { Toast } from '@/services/toast'
import { useI18n } from 'vue-i18n'

//* import component
import CustomDatepicker from '@/components/CustomDatepicker.vue'

// * import constant
import { FREQUENCY } from '@/services/constant/create_note'

//* store
const appStore = useAppStore()
const commonStore = useCommonStore()
// * props
const props = defineProps({
  /** Nội dung của ghi chú */
  input_content: String,
})

// * khởi tạo thông báo
const $toast = new Toast()

//* i18n
const { t } = useI18n()

// * emits
const emit = defineEmits(['update:input_content', 'changeTab'])

/** tần suất được chọn */
const frequency_selected = ref<string>(initFrequency())

/** bật/tắt chế độ nhắc lịch */
const is_remind = ref<boolean>(initIsRemind())

/** ngày đặt lịch */
const date_value = ref<Date>(initDate())

/** giờ đặt lịch */
const time_value = ref<{ hour: number; minute: number }>(initTime())

/** hàm khởi tạo giá trị tần suất */
function initFrequency() {
  if (
    // kiểm tra xem có phải chế độ sửa không, nếu khác -1 là chế độ sửa
    appStore.isUpdateNote() &&
    //  kiểm tra có tồn tại tần suất không
    appStore.selectedNote()?.frequency
  )
    // trả về giá trị tần suất của ghi chú chọn để sửa
    return appStore.selectedNote()?.frequency || ''
  return 'NONE'
}

/** hàm khởi tạo giá trị cho bật/tắt nhắc lịch */
function initIsRemind() {
  if (
    // kiểm tra xem có phải chế độ sửa không, nếu khác -1 là chế độ sửa
    appStore.isUpdateNote() &&
    // kiểm tra có tồn tại thời gian đặt lịch không
    appStore.selectedNote()?.schedule_time
  )
    return true
  return false
}

/** hàm khởi tạo giá trị cho ngày đặt lịch */
function initDate() {
  if (
    // kiểm tra xem có phải chế độ sửa không, nếu khác -1 là chế độ sửa
    appStore.isUpdateNote() &&
    // kiểm tra xem có tồn tại ngày đặt lịch không
    appStore.selectedNote()?.schedule_time
  ) {
    return new Date(appStore.selectedNote()?.schedule_time || 0)
  }
  return getCurrentDate()
}

/** hàm khởi tạo giá trị cho thời gian đặt lịch */
function initTime() {
  // lấy thời gian hiện tại
  let currrent_date = new Date()
  if (
    // kiểm tra xem có phải chế độ sửa không, nếu khác -1 là chế độ sửa
    appStore.isUpdateNote() &&
    // kiểm tra xem giờ đặt lịch có tồn tại không
    appStore.selectedNote()?.schedule_hour &&
    // kiểm tra xem phút đặt lịch có tồn tại không
    appStore.selectedNote()?.schedule_minute
  ) {
    return {
      hour: appStore.selectedNote()?.schedule_hour || 0,
      minute: appStore.selectedNote()?.schedule_minute || 0,
    }
  }
  // nếu không tồn tại trả về giờ và phút hiện tại
  return { hour: currrent_date.getHours(), minute: currrent_date.getMinutes() }
}

/** hàm bật/tắt nhắc lịch */
function toogleRemind() {
  is_remind.value = !is_remind.value
}

/** hàm đóng tab tạo mới ghi chú */
function closeCreate() {
  // thiết lập nội dung của ô nhập nội dung ghi chú về trống
  emit('update:input_content', '')
  // chuyển sáng tab danh sách ghi chú
  emit('changeTab', 'NOTE_LIST')
  // xóa số thứ tự của ghi chú nếu đang sửa 1 ghi chú nào đó
  appStore.note_index = -1
}

/** hàm lấy ngày hôm nay tại lúc 0 giờ 0 phút 0 giây */
function getCurrentDate() {
  return new Date()
}

/** hàm tạo thời gian đặt lịch với giờ và ngày đã chọn */
function getDateTime(hour: number, minute: number, date: number): number {
  // chuyển từ timestamp sang Date
  let date_temp = new Date(date)
  // tạo chuỗi date có dạng yyyy/mm/dd
  let date_string = `${date_temp.getFullYear()}/${
    date_temp.getMonth() + 1
  }/${date_temp.getDate()}`
  // tao chuỗi time có dạng hh:mm
  let time_string = `${hour}:${minute}`

  // trả về giá trị timestamp của ngày và giờ được truyền vào
  return new Date(date_string + ' ' + time_string).getTime()
}

/** hàm tạo ghi chú mới */
async function createNewNote() {
  try {
    // nếu chưa nhập nội dung ghi chú thì không thực hiện
    if (!props.input_content) return

    //bật loading
    appStore.is_loading = true

    // call api tạo mới note hoặc sửa note
    let result = await request({
      // nếu số thứ tự của sửa ghi chú tồn tại thì sử dụng endpoint sửa
      // nếu không thì sử dụng endpoint tạo ghi chú
      path: appStore.isUpdateNote() ? '/v1/note/update' : '/v1/note/create',
      body: {
        _id: appStore.isUpdateNote() ? appStore.selectedNote()?._id : null,
        label: 'note',
        content: props.input_content,
        schedule_time: is_remind.value
          ? getDateTime(
              time_value.value.hour,
              time_value.value.minute,
              date_value.value.setHours(0, 0, 0, 0)
            )
          : null,
        frequency: frequency_selected.value,
        fb_staff_id: commonStore.data_client?.public_profile?.current_staff_id,
        staff_name: commonStore.data_client?.public_profile?.current_staff_name,
      },
      method: 'POST',
      json: true,
    })
    if (!(result.code === 200)) throw result.message

    // kiểm tra có phải tạo mới ghi chú không
    if (!appStore.isUpdateNote()) {
      // thêm ghi chú mới tạo vào danh sách ghi chú
      appStore.note_list = [result.data, ...appStore.note_list]
    } else {
      // sửa ghi chú trong danh sách ghi chú
      appStore.note_list[appStore.note_index] = result.data
    }

    //tắt loading
    appStore.is_loading = false
    // thông báo thành công
    $toast.success(
      appStore.isUpdateNote() ? t('update_sucess') : t('create_new_success'),
      'right',
      'top'
    )
    //tạo thành công thì clear các input và chuyển sang tab danh sách ghi chú
    closeCreate()
  } catch (error) {
    console.log(error)
    // thông báo thất bại
    $toast.error('Tạo thất bại', 'right', 'top')
    // tắt loading
    appStore.is_loading = false
  }
}

// xuất hàm tạo ghi chú
defineExpose({ createNewNote })
</script>
