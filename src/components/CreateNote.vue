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
        <!-- :shortcuts="shortcuts"
          open.sync="open_calendar" -->
        <!-- <date-picker
          prefix-class="xmx"
          placeholder="Không lập lịch"
          class="w-full h-full"
          v-model:value="date_picker"
          value-type="timestamp"
          :type="type_date_picker"
          :format="date_picker_format"
          input-class="w-full border-2 pt-1 pb-1.5 px-3 rounded outline-none placeholder:text-gray-500"
          :confirm="true"
          confirm-text="Xác nhận"
          :editable="false"
          :clearable="false"
        >
        </date-picker> -->
        <VueDatePicker
          v-model:value="date_picker"
          teleport-center
          time-picker-inline
        >
        </VueDatePicker>
      </div>
      <div class="col-span-1 flex flex-col gap-1">
        <label class="text-xs">{{ $t('frequency') }}</label>
        <select
          v-model="frequency_selected"
          class="border-2 px-3 rounded outline-none h-full"
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
        {{ $t('save') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { useAppStore, useCommonStore } from '@/services/stores'

// * import library
import { ref, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/locale/vi.es'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// * import constant
import { FREQUENCY } from '@/services/constant/create_note'
import { request } from '@/services/request'
import { Toast } from '@/services/toast'
import { useI18n } from 'vue-i18n'

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

/** thời gian nhắc lịch */
const date_picker = ref<number | null>(Date.now())
/** kiểu thời gian nhắc lịch  */
const type_date_picker = ref<string>('datetime')
/** định dạng thời gian */
const date_picker_format = ref<string>('HH:mm DD/MM/YYYY')
/** tần suất được chọn */
const frequency_selected = ref<string>('NONE')
/** bật/tắt chế độ nhắc lịch */
const is_remind = ref<boolean>(false)

// lắng nghe event thay đổi tần suất để chọn định dạng cho input nhập ngày
watch(
  () => frequency_selected.value,
  (val: string) => {
    // không nhắc lại
    if (val == 'NONE') {
      type_date_picker.value = 'datetime'
      date_picker_format.value = 'HH:mm DD/MM/YYYY'
    }
    // nhắc hàng ngày
    if (val == 'EVERY_DAY') {
      type_date_picker.value = 'time'
      date_picker_format.value = 'HH:mm a'
      date_picker.value = Date.now()
    }
    //nhắc hàng tuần
    if (val == 'EVERY_WEEk') {
      type_date_picker.value = 'datetime'
      date_picker_format.value = 'HH:mm dddd'
      date_picker.value = Date.now()
    }
    // nhắt hàng tháng
    if (val == 'EVERY_MONTH') {
      type_date_picker.value = 'datetime'
      date_picker_format.value = 'HH:mm DD/MM/YYYY'
      date_picker.value = Date.now()
    }
  }
)
/** hàm bật/tắt nhắc lịch */
function toogleRemind() {
  is_remind.value = !is_remind.value
}

/** hàm đóng tab tạo mới ghi chú */
function closeCreate() {
  emit('update:input_content', '')
  date_picker.value = null
  emit('changeTab', 'NOTE_LIST')
}

/** hàm tạo ghi chú mới */
async function createNewNote() {
  try {
    //bật loading
    appStore.is_loading = true

    // nếu chưa nhập nội dung ghi chú thì không thực hiện
    if (!props.input_content) return
    // call api tạo mới note
    await request({
      path: '/v1/note/create',
      body: {
        label: 'note',
        content: props.input_content,
        schedule_time: date_picker.value,
        frequency: frequency_selected.value,
        fb_staff_id: commonStore.data_client?.public_profile?.current_staff_id,
        staff_name: commonStore.data_client?.public_profile?.current_staff_name,
      },
      method: 'POST',
      json: true,
    })

    //tắt loading
    appStore.is_loading = false
    $toast.success(t('create_new_success'), 'right', 'top')
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
<style lang="scss">
$namespace: 'xmx'; // change the 'mx' to 'xmx'. then <date-picker prefix-class="xmx" />
$default-color: #555;
$primary-color: #f55600;
@import 'vue-datepicker-next/scss/index.scss';
@media screen and (min-width: 768px) {
  .xmx-date-time {
    height: 250px;
  }
  .xmx-calendar-content {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  .xmx-table thead {
    // z-index: 1;
    background: #ffffff;
    position: sticky;
    top: 0;
  }
  .xmx-time-content {
    max-height: calc(100vh - 85px);
  }
}
</style>
