<template>
  <div class="flex gap-1">
    <VueDatePicker
      :disabled="props.frequency_selected === 'EVERY_DAY'"
      v-model="date_value"
      input-class-name="border-1 outline-none h-full text-sm text-gray-500 px-2 text-center"
      teleport-center
      :enable-time-picker="false"
      :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
      :format-locale="vi"
      :min-date="new Date()"
      hide-input-icon
      :format="
        props.frequency_selected === 'EVERY_WEEK' ? customFormat : 'dd/MM/yyyy'
      "
      menu-class-name="text-sm shadow-md"
      :clearable="false"
      auto-apply
    >
    </VueDatePicker>
    <div
      class="border px-2 rounded outline-none h-full flex items-center justify-center cursor-pointer relative"
      @click="openTimePicker"
    >
      {{ time_value.hour.toString().padStart(2, '0') }}:{{
        time_value.minute.toString().padStart(2, '0')
      }}
    </div>
    <Teleport to="body">
      <div
        class="w-screen h-screen fixed top-0 left-0 text-gray-500 font-medium"
        v-if="is_show_time_picker"
        @click="is_show_time_picker = false"
      >
        <div
          @click.stop
          ref="time_picker"
          v-if="is_show_time_picker"
          class="fixed flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border rounded text-sm shadow-md"
        >
          <p class="text-center border-b py-2">
            {{ timestampToDate(date_value.valueOf()) }}
          </p>
          <div class="flex flex-grow">
            <ul
              class="max-h-48 overflow-auto custom-scrollbar text-center w-28 border-r"
            >
              <li
                v-for="item in hours"
                :key="item"
                class="cursor-pointer py-1"
                :class="{
                  'bg-[#ea580c] text-white font-medium active':
                    item === time_value.hour,
                  'hover:bg-gray-200': item !== time_value.hour,
                  'pointer-events-none text-gray-200': prevent_pass(
                    item,
                    'HOUR'
                  ),
                }"
                @click="time_value.hour = item"
              >
                {{ item.toString().padStart(2, '0') }}
              </li>
            </ul>
            <ul
              class="max-h-48 overflow-auto custom-scrollbar text-center w-28"
            >
              <li
                v-for="item in minutes"
                :key="item"
                class="cursor-pointer py-1"
                :class="{
                  'bg-[#ea580c] text-white font-medium active':
                    item === time_value.minute,
                  'hover:bg-gray-200': item !== time_value.minute,
                  'pointer-events-none text-gray-200': prevent_pass(
                    item,
                    'MINUTE'
                  ),
                }"
                @click="
                  () => {
                    time_value.minute = item
                    is_show_time_picker = false
                  }
                "
              >
                {{ item.toString().padStart(2, '0') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// TODO : chưa improve code
//* import function
import { scrollToSelected } from '@/services/scroll'
import { timestampToDate } from '@/services/format/date'
//* import library
import { vi } from 'date-fns/locale'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, nextTick, ref, watch } from 'vue'

/** label các thứ trong toàn */
const dayInWeek = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
]

/** props */
const props = defineProps<{
  /** tần suất đặt lịch */
  frequency_selected: string
}>()

/** ngày đặt lịch */
const date_value = defineModel<Date>('date', {
  default: new Date(),
})

/** thời gian đặt lịch */
const time_value = defineModel<{ hour: number; minute: number }>('time', {
  default: { hour: 0, minute: 0 },
})

/** tham chiếu tới modal nhập thời gian */
const time_picker = ref<HTMLElement>()

/** hiện modal chọn thời gian */
const is_show_time_picker = ref<boolean>(false)

/** tạo danh sách giờ */
const hours = computed(() => {
  let arr = []
  for (let i = 0; i < 24; i++) {
    arr.push(i)
  }
  return arr
})
/** tạo danh sách phút */
const minutes = computed(() => {
  let arr = []
  for (let i = 0; i < 60; i++) {
    arr.push(i)
  }
  return arr
})

function prevent_pass(value: number, type: 'HOUR' | 'MINUTE') {
  if (
    props.frequency_selected !== 'NONE' ||
    date_value.value.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
  )
    return false
  if (type === 'HOUR' && value < new Date().getHours()) return true
  if (
    type === 'MINUTE' &&
    value < new Date().getMinutes() &&
    time_value.value.hour === new Date().getHours()
  )
    return true
  return false
}

/** khi chọn tần suất thì đặt thời gian là hiện tại */
watch(
  () => props.frequency_selected,
  () => {
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    date_value.value = today
    time_value.value = {
      hour: today.getHours(),
      minute: today.getMinutes(),
    }
  }
)
/** khi chọn ngày nếu là hôm nay thì đặt giờ là hiện tại */
watch(
  () => date_value.value,
  (value) => {
    if (value.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0))
      time_value.value = {
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      }
  }
)

/** khi chọn giờ thì scroll tới */
watch(
  () => time_value.value.hour,
  (newValue, oldValue) => {
    if (time_value.value.minute < new Date().getMinutes())
      time_value.value.minute = new Date().getMinutes()
    if (newValue === oldValue) return
    nextTick(() => {
      scrollToSelected(200, time_picker)
    })
  }
)

// khi mở modal chọn thời gian thì scroll tới giờ đang chọn
watch(is_show_time_picker, (newValue) => {
  if (!newValue) return
  nextTick(() => {
    scrollToSelected(0, time_picker)
  })
})
/** hàm mở modal chọn thời gian */
function openTimePicker() {
  is_show_time_picker.value = true
}

/** format cho datepicker khi chọn tần suất là hằng tuần */
function customFormat(date: Date) {
  return `${dayInWeek[date.getDay()]}`
}
</script>
<style lang="scss">
.custom-scrollbar {
  scrollbar-width: thin;
}
</style>
