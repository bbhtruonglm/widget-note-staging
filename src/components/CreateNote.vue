<template>
  <div class="text-sm flex flex-col gap-2.5">
    <div class="flex gap-2 justify-end cursor-pointer">
      <div
        class="flex gap-2 w-fit"
        @click="toogleRemind()"
      >
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
        {{ appStore.note_index !== -1 ? $t('update') : $t('save') }}
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

const $toast = new Toast()
const { t } = useI18n()

// * emits
const emit = defineEmits(['update:input_content', 'changeTab'])

/** tần suất được chọn */
const frequency_selected = ref<string>(initFrequency())

/** bật/tắt chế độ nhắc lịch */
const is_remind = ref<boolean>(initIsRemind())

/** ngày đặt lịch */
const date_value = ref<Date>(initDate())
const time_value = ref<{ hour: number; minute: number }>(initTime())

/** hàm khởi tạo giá trị tần suất */
function initFrequency() {
  // index bằng -1 là đang ở chế độ sửa và có tần suất đặt lịch thì khởi tạo
  if (
    appStore.note_index !== -1 &&
    appStore.note_list[appStore.note_index].frequency
  )
    return appStore.note_list[appStore.note_index].frequency || ''
  return 'NONE'
}

/** hàm khởi tạo giá trị cho bật/tắt nhắc lịch */
function initIsRemind() {
  // index bằng -1 là đang ở chế độ sửa và có thời gian đặt lịch thì khởi tạo là true
  if (
    appStore.note_index !== -1 &&
    appStore.note_list[appStore.note_index].schedule_time
  )
    return true
  return false
}

/** hàm khởi tạo giá trị cho ngày đặt lịch */
function initDate() {
  // index bằng -1 là đang ở chế độ sửa và có thời gian đặt lịch thì khởi tạo
  //là thời gian đặt lịch đó

  if (
    appStore.note_index !== -1 &&
    appStore.note_list[appStore.note_index].schedule_time
  ) {
    return new Date(appStore.note_list[appStore.note_index].schedule_time || 0)
  }

  return getCurrentDate()
}

/** hàm khởi tạo giá trị cho thời gian đặt lịch */
function initTime() {
  if (
    appStore.note_index !== -1 &&
    appStore.note_list[appStore.note_index].schedule_time
  ) {
    return {
      hour: new Date(
        appStore.note_list[appStore.note_index].schedule_time || 0
      ).getHours(),
      minute: new Date(
        appStore.note_list[appStore.note_index].schedule_time || 0
      ).getMinutes(),
    }
  }

  return { hour: new Date().getHours(), minute: new Date().getMinutes() }
}

/** hàm bật/tắt nhắc lịch */
function toogleRemind() {
  is_remind.value = !is_remind.value
}

/** hàm đóng tab tạo mới ghi chú */
function closeCreate() {
  emit('update:input_content', '')
  emit('changeTab', 'NOTE_LIST')
  appStore.note_index = -1
}

/** hàm lấy ngày hôm nay tại lúc 0 giờ 0 phút 0 giây */
function getCurrentDate() {
  return new Date()
}

function getDateTime(hour: number, minute: number, date: number) {
  let date_temp = new Date(date)
  let date_string = `${date_temp.getFullYear()}/${
    date_temp.getMonth() + 1
  }/${date_temp.getDate()}`
  let time_string = `${hour}:${minute}`

  return new Date(date_string + ' ' + time_string).getTime()
}

/** hàm tạo ghi chú mới */
async function createNewNote() {
  try {
    //bật loading
    appStore.is_loading = true

    // nếu chưa nhập nội dung ghi chú thì không thực hiện
    if (!props.input_content) return
    // call api tạo mới note
    let result = await request({
      path: appStore.note_index !== -1 ? '/v1/note/update' : '/v1/note/create',
      body: {
        _id:
          appStore.note_index !== -1
            ? appStore.note_list[appStore.note_index]._id
            : null,
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

    // kiểm tra có phải tạo mới ghi chứ không
    if (appStore.note_index === -1) {
      // thêm ghi chú mới tạo vào danh sách ghi chú
      appStore.note_list = [result.data, ...appStore.note_list]
    } else {
      // sửa ghi chú trong danh sách ghi chú
      appStore.note_list[appStore.note_index] = result.data
    }

    //tắt loading
    appStore.is_loading = false
    $toast.success(
      appStore.note_index !== -1 ? t('update_sucess') : t('create_new_success'),
      'right',
      'top'
    )
    //tạo thành công thì clear các input và chuyển sang tab danh sách ghi chú
    closeCreate()
  } catch (error) {
    console.log(error)
    $toast.error('Tạo thất bại', 'right', 'top')
    // tắt loading
    appStore.is_loading = false
  }
}

// xuất hàm tạo ghi chú
defineExpose({ createNewNote })
</script>
