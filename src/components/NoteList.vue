<template>
  <div>
    <div class="body-schedule-list h-56 overflow-y-auto scrollbar-thin flex flex-col gap-2" v-show="!is_show_edit">
      <div class="px-3 py-2 flex flex-col gap-1 bg-slate-100 w-[99%] rounded-lg font-medium text-xs text-slate-500"
        v-for="(item, index) in note_list" :key="index" v-show="note_list.length">
        <div class="flex justify-between">
          <span :class="{
            'font-semibold': !item.finished && item.schedule_time,
          }">
            <!-- <span v-if="item.staff_name">
                                {{ item.staff_name }} -
                            </span> -->

            {{ item.createdAt ? convertTimeList(item.createdAt) : '' }}

<<<<<<< HEAD
            <span
              class="text-red-500 font-semibold"
              v-show="item.finished && !item.watched"
            >
              ({{ $t('not_seen') }})
=======
            <span class="text-red-500 font-semibold" v-show="item.finished && !item.watched">
              ({{ $t("not_seen") }})
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e
            </span>

            <span v-show="item.finished && item.watched">
              ({{ $t('seen') }})
            </span>
          </span>

<<<<<<< HEAD
          <span
            class="text-green-600 font-semibold"
            v-show="item.finished && item.schedule_time"
          >
            {{ $t('finished') }}
=======
          <span class="text-green-600 font-semibold" v-show="item.finished && item.schedule_time">
            {{ $t("finished") }}
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e
          </span>

          <span class="text-orange-600 font-semibold" v-show="!item.finished && item.schedule_time && !item.is_remove">
            <!-- {{item.schedule_time | time_more}} -->
            {{ showTimeMore(item.schedule_time) }}
          </span>

          <span class="text-black font-semibold" v-show="item.is_remove">
            {{ $t('clear_calendar') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <img :src="CalendarIcon" />
          <div>
            <p :class="{
              'line-through': item.finished,
              'text-red-500': !item.watched && item.finished,
            }">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
      <div class="w-full h-60 flex items-center justify-center flex-col" v-show="!note_list.length">
        <img class="w-24" src="./../assets/empty.svg" alt="" />
        <p class="text-gray-600">Chưa có ghi chú</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import { Resful } from '@/services/resful'
=======
import { Resful } from "@/services/resful";
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e
//* import library
import WIDGET from 'bbh-chatbox-widget-js-sdk'

//* import icon
<<<<<<< HEAD
import CalendarIcon from '@/assets/calendar.svg'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
=======
import CalendarIcon from "@/assets/calendar.svg";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e

// const schedule_labels = [
//   {
//     name: this.$t("all"),
//     value: "",
//   },
//   {
//     name: this.$t("note"),
//     value: "note",
//   },
//   {
//     name: this.$t("appointment_reminder"),
//     value: "appointment_reminder",
//   },
//   {
//     name: this.$t("support"),
//     value: "support",
//   },
//   {
//     name: this.$t("meeting"),
//     value: "meeting",
//   },
//   {
//     name: this.$t("leave_the_office"),
//     value: "leave_the_office",
//   },
//   {
//     name: this.$t("email"),
//     value: "email",
//   },
// ];
const schedule_labels = [
  {
    name: 'note',
    value: 'note',
  },
]

// const time_selected = ref<string>("");
const is_show_edit = ref<boolean>(false)
const note_list = ref<any>([])

onMounted(() => {
  getNoteList()
  WIDGET.onEvent(async () => {
<<<<<<< HEAD
    access_token = WIDGET.access_token as string
    getNoteList()
  })
})
=======
    globalThis.access_token = WIDGET.access_token as string;
    getNoteList();
  });
});
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e

function convertTimeList(value: number) {
  if (!value) return ''
  const date = new Date(value)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // Month is zero-indexed
  const year = date.getFullYear()

  return `${hours}:${minutes} - ${day}/${month}/${year}`
}
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

function getNoteList() {
  Resful.post(
    {
      access_token: globalThis.access_token || '',
      body: {},
      path: '/v1/note/read',
    },
    (e: any, r: any) => {
      if (e) return console.log(e)
      // console.log(r.data.data);

      note_list.value = r.data.data.map((item: any) => {
        schedule_labels.map((item1) => {
          if (item.label === item1.value) {
            item.label = item1.name
          }
        })

        if (item.fb_staff_id) {
          item.avatar = `https://graph.facebook.com/${item.fb_staff_id}/picture`
        }

        return item
      })
    }
  )
}
</script>

<style scoped lang="scss"></style>
