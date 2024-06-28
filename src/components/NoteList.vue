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
                    v-show="
                        !item.finished && item.schedule_time && !item.is_remove
                    "
                >
                    {{ item.schedule_time && showTimeMore(item.schedule_time) }}
                </span>

                <span class="text-black font-semibold" v-show="item.is_remove">
                    {{ $t('clear_calendar') }}
                </span>
            </div>
            <div class="flex items-center gap-2">
                <img v-if="item.schedule_time" :src="CalendarIcon" />
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
            <img class="w-48" src="./../assets/empty.svg" alt="" />
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

const { t } = useI18n()

// * store
const appStore = useAppStore()

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

/** hàm xử lý khi nhấn vào một note để chỉnh sửa */
function editNote(item: INote, index: number) {
    appStore.note_content = item.content || ''
    appStore.note_index = index

    appStore.tab_selected = 'CREATE_NEW'
}
</script>

<style scoped lang="scss"></style>
