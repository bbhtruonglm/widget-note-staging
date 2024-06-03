<template>
  <div
    class="body-schedule-list h-full overflow-y-auto scrollbar-thin flex flex-col gap-2"
  >
    <div
      class="px-3 py-2 flex flex-col gap-1 bg-slate-100 w-[99%] rounded-lg font-medium text-xs text-slate-500"
      v-for="(item, index) in note_list"
      :key="index"
      v-if="note_list.length"
    >
      <div class="flex justify-between">
        <span
          :class="{
            'font-semibold': !item.finished && item.schedule_time,
          }"
        >
          {{ item.createdAt ? convertTimeList(item.createdAt) : '' }}

          <span
            class="text-red-500 font-semibold"
            v-show="item.finished && !item.watched"
          >
            ({{ $t('not_seen') }})
          </span>

          <span v-show="item.finished && item.watched">
            ({{ $t('seen') }})
          </span>
        </span>

        <span
          class="text-green-600 font-semibold"
          v-show="item.finished && item.schedule_time"
        >
          {{ $t('finished') }}
        </span>

        <span
          class="text-orange-600 font-semibold"
          v-show="!item.finished && item.schedule_time && !item.is_remove"
        >
          {{ showTimeMore(item.schedule_time) }}
        </span>

        <span class="text-black font-semibold" v-show="item.is_remove">
          {{ $t('clear_calendar') }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <img :src="CalendarIcon" />
        <div>
          <p
            :class="{
              'line-through': item.finished,
              'text-red-500': !item.watched && item.finished,
            }"
            class="truncate w-60 sm:w-72"
          >
            {{ item?.content }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="w-full h-60 flex items-center justify-center flex-col"
      v-if="!note_list.length"
    >
      <img class="w-48" src="./../assets/empty.svg" alt="" />
      <p class="text-gray-600 font-medium mt-2">
        <!-- Hãy bắt đầu bằng việc tạo ghi chú mới! -->
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { request } from '@/services/request'
import { convertTimeList } from '@/services/format/date'

//* import library
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

//* import icon
import CalendarIcon from '@/assets/calendar.svg'
import { useAppStore } from '@/services/stores'

const { t } = useI18n()

// * store
const appStore = useAppStore()

/** danh sách ghi chú */
const note_list = ref<any>([])

//lấy danh sách khi nhận thông báo từ chatbox
WIDGET.onEvent(async () => {
  getNoteList()
})
onMounted(() => {
  //lấy danh sách khi bật app
  getNoteList()
})

/** hàm chuyển từ khoảng timestamp sang khoảng thời gian ví dụ: 3600 -> 1 giờ */
function showTimeMore(value: number) {
  if (!value) return ''
  if (value < Date.now()) return ''
  let seconds = Math.floor((value - Date.now()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + ' ' + t('year_more')
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' ' + t('month_more')
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' ' + t('day_more')
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' ' + t('hour_more')
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' ' + t('minute_more')
  }
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

    note_list.value = result.data
  } catch (error) {
    console.log('get note list', error)
    //tắt loading
    appStore.is_loading = false
  }
}
</script>

<style scoped lang="scss"></style>
