<template>
  <div
    class="body-schedule-list h-full overflow-y-auto scrollbar-thin flex flex-col gap-2"
  >
    <div
      class="px-3 py-2 flex flex-col gap-1 bg-slate-100 w-[99%] rounded-lg font-medium text-sm text-slate-500 cursor-pointer hover:bg-slate-200"
      v-for="(item, index) in appStore.note_list"
      :key="index"
      v-if="appStore.note_list.length"
      @click="editNote(item, index)"
    >
      <div class="flex justify-between text-xs">
        <!-- :class="{
            'font-medium': !item.finished && item.schedule_time,
          }" -->
        <span class="font-medium">
          {{ item.createdAt ? convertTimeList(item.createdAt) : '' }}
        </span>

        <span
          class="text-green-600 font-semibold"
          v-show="item.finished && item.schedule_time"
        >
          {{ $t('finished') }}
        </span>

        <span
          class="text-orange-500 font-semibold"
          v-show="!item.finished && item.schedule_time && !item.is_remove"
        >
          {{ item.schedule_time && showTimeMore(item.schedule_time) }}
        </span>

        <span
          class="text-black font-semibold"
          v-show="item.is_remove"
        >
          {{ $t('clear_calendar') }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <img
          v-if="item.schedule_time"
          :src="CalendarIcon"
        />
        <div>
          <p
            :class="{
              'line-through': item.finished,
              // 'text-red-500': !item.watched && item.finished,
            }"
            class="truncate w-60 sm:w-72 whitespace-pre-line"
          >
            {{ item?.content }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="w-full h-60 flex items-center justify-center flex-col"
      v-if="!appStore.note_list.length"
    >
      <img
        class="w-48"
        src="./../assets/empty.svg"
        alt=""
      />
      <p class="text-gray-600 font-medium mt-2">
        <!-- Hãy bắt đầu bằng việc tạo ghi chú mới! -->
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { convertTimeList } from '@/services/format/date'

//* import library
import { useI18n } from 'vue-i18n'

//* import icon
import CalendarIcon from '@/assets/calendar.svg'
import { useAppStore } from '@/services/stores'
import { INote } from '@/interface/note'

// * i18n
const { t } = useI18n()

// * store
const appStore = useAppStore()

/** hàm tính thời gian còn lại cho tới thời gian đặt lịch */
function showTimeMore(value: number): string {
  if (!value) return ''
  if (value < Date.now()) return ''

  /** số giây trong 1 năm */
  const YEAR_SECONDS = 31536000
  /** số giây trong 1 tháng */
  const MONTH_SECONDS = 2592000
  /** số giây trong 1 ngày */
  const DAY_SECONDS = 86400
  /** số giây trong 1 giờ */
  const HOUR_SECONDS = 3600
  /** số giây trong 1 phút */
  const MINUTE_SECONDS = 60

  // chuyển thời gian còn lại sang giây
  let seconds = Math.floor((value - Date.now()) / 1000)

  // tính số năm còn lại
  let interval = seconds / YEAR_SECONDS
  if (interval > 1) return Math.floor(interval) + ' ' + t('year_more')

  // tính số tháng còn lại
  interval = seconds / MONTH_SECONDS
  if (interval > 1) return Math.floor(interval) + ' ' + t('month_more')

  // tính số ngày còn lại
  interval = seconds / DAY_SECONDS
  if (interval > 1) return Math.floor(interval) + ' ' + t('day_more')

  // tính số giờ còn lại
  interval = seconds / HOUR_SECONDS
  if (interval > 1) return Math.floor(interval) + ' ' + t('hour_more')

  // tính số phút còn lại
  interval = seconds / MINUTE_SECONDS
  if (interval > 1) return Math.floor(interval) + ' ' + t('minute_more')

  // nếu nhỏ hơn 60 giây thì không trả về gì
  return ''
}

/** hàm xử lý khi nhấn vào một note để chỉnh sửa */
function editNote(item: INote, index: number) {
  // gán nội dung ghi chú là nội dung của ghi chú đã chọn để sứa
  appStore.note_content = item.content || ''
  // lưu số thứ tự của ghi chú đó trong danh sách
  appStore.note_index = index
  // chuyển sang tab cho phép chỉnh sửa ghi chú
  appStore.tab_selected = 'CREATE_NEW'
}
</script>

<style scoped lang="scss"></style>
