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
        <date-picker
          prefix-class="xmx"
          placeholder="Không lập lịch"
          class="w-full h-full"
          v-model:value="date_picker"
          value-type="timestamp"
          :type="type_date_picker"
          :format="date_picker_format"
          :show-week-number="show_week_number"
          input-class="w-full border-2 pt-1 pb-1.5 px-3 rounded outline-none placeholder:text-gray-500"
          :confirm="true"
          confirm-text="Xác nhận"
        >
          <!-- <template #footer>
            <button class="bg-orange-600 text-white px-2 rounded-md">
              Chọn
            </button>
          </template> -->
        </date-picker>
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
      <div class="w-1/4 text-center cursor-pointer hover:font-bold">
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
import { useCommonStore } from '@/services/stores'

// * import library
import { ref, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/locale/vi'

// * import constant
import { FREQUENCY } from '@/services/constant/create_note'
import { Resful } from '@/services/resful.js'

const commonStore = useCommonStore()
// * props
const props = defineProps({
  /** Nội dung của ghi chú */
  input_content: String,
})

const emit = defineEmits(['update:input_content', 'changeTab'])

/** thời gian nhắc lịch */
const date_picker = ref<number | null>(Date.now())
/** kiểu thời gian nhắc lịch  */
const type_date_picker = ref<string>('datetime')
/** định dạng thời gian */
const date_picker_format = ref<string>('HH:mm DD/MM/YYYY')
const show_week_number = ref<boolean>(true)
/** tần suất được chọn */
const frequency_selected = ref<string>('NONE')
/** bật/tắt chế độ nhắc lịch */
const is_remind = ref<boolean>(false)

watch(
  () => frequency_selected.value,
  (val: string) => {
    if (val == 'NONE') {
      type_date_picker.value = 'datetime'
      date_picker_format.value = 'HH:mm DD/MM/YYYY'
    }
    if (val == 'EVERY_DAY') {
      type_date_picker.value = 'time'
      date_picker_format.value = 'HH:mm a'
      date_picker.value = Date.now()
    }
    if (val == 'EVERY_WEEk') {
      type_date_picker.value = 'datetime'
      date_picker_format.value = 'HH:mm dddd'
      date_picker.value = Date.now()
    }
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

const createNewNote = () => {
  if (!props.input_content) return
  Resful.post(
    {
      access_token: globalThis.access_token || access_token,
      body: {
        label: 'note',
        content: props.input_content,
        schedule_time: date_picker.value,
        frequency: frequency_selected.value,
        fb_staff_id: commonStore.data_client?.public_profile?.current_staff_id,
        staff_name: commonStore.data_client?.public_profile?.current_staff_name,
      },
      path: '/v1/note/create',
    },
    (e: any) => {
      if (e) return console.log(e)
      let content = document.getElementById('content')
      if (content) content.innerHTML = ''
      emit('update:input_content', '')
      date_picker.value = null
      emit('changeTab', 'NOTE_LIST')
      // this.$toasted.success(this.$t("create_new_success"), {
      //   duration: 1000,
      // });
    }
  )
}

defineExpose({ createNewNote })
</script>
<style lang="scss">
$namespace: 'xmx'; // change the 'mx' to 'xmx'. then <date-picker prefix-class="xmx" />
$default-color: #555;
$primary-color: #f55600;
@import 'vue-datepicker-next/scss/index.scss';
</style>
