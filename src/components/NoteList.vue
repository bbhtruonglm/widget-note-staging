<template>
    <div>
        <!-- Label -->
        <!-- <div class="labels padding-bottom">
            <div v-for="(item, index) in schedule_labels" :key="index" class="label-primary label-gray custom-label"
                :class="{ 'label-black': item.value === schedule_selected }"
                @click="schedule_selected = item.value, getNoteList()">
                <span class="text-vertical-center">{{ item.name }}</span>
            </div>
        </div> -->

        <div class="body-schedule-list" v-show="!is_show_edit">

            <div 
                class="schedule-list" v-for="(item, index) in note_list" 
                :key="index" @click="showEdit(item)"
                v-show="note_list.length"
            >
                <div class="staff-avatar">

                    <div class="staff-info" v-if="item.fb_staff_id">
                        <img :src="item.avatar">
                    </div>

                </div>

                <div class="note-content">

                    <div class="time">
                        <span :class="{ 'time-number': !item.finished && item.schedule_time }">

                            <span v-if="item.staff_name">
                                {{ item.staff_name }} -
                            </span>

                            {{ item.createdAt | convert_time }}

                            <span class="text-red text-bold" v-show="item.finished && !item.watched">
                                ({{ $t('not_seen') }})
                            </span>

                            <span v-show="item.finished && item.watched">
                                ({{ $t('seen') }})
                            </span>

                        </span>

                        <span class="text-green text-bold" v-show="item.finished && item.schedule_time">
                            {{ $t('finished') }}
                        </span>

                        <span class="text-orange text-bold"
                            v-show="!item.finished && item.schedule_time && !item.is_remove">
                            <!-- {{item.schedule_time | time_more}} -->
                            {{ showTimeMore(item.schedule_time) }}
                        </span>

                        <span class="text-black text-bold" v-show="item.is_remove">
                            {{ $t('clear_calendar') }}
                        </span>

                    </div>

                    <div class="content">
                        <div class="label-primary label-gray custom-time">
                            <span>
                                {{ item.label }}
                            </span>
                        </div>
                        <div class="schedule-content">
                            <p :class="{ 'line-through': item.finished, 'text-red': !item.watched && item.finished }">
                                {{ item.content }}
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            <div class="empty" v-show="!note_list.length">
                <img src="./../assets/empty.svg" alt="">
                <p>Chưa có ghi chú</p>
            </div>

        </div>

        <div class="edit-note" v-show="is_show_edit">
            <!-- Input -->
            <div class="input-content">

                <div class="input-flex">
                    <div id="content" contenteditable="plaintext-only" placeholder="Nhập nội dung ghi chú ..."
                        class="chat-input-text" @input="onInput">
                    </div>
                </div>

            </div>

            <!-- Fast Time Select  -->
            <div class="time-select">

                <div class="title">
                    Chọn nhanh
                </div>

                <!-- <div class="alert-before">
                    Báo trước: <span class="text-orange">15 phút</span>
                    <img src="./../assets/right_arrow.svg" alt="">
                </div> -->

            </div>

            <!-- Time label -->
            <div class="time-labels">
                <div v-for="(item, index) in time_tabs" :key="index" class="label-primary"
                    :class="{ 'label-orange': item.value === time_selected }" @click="time_selected = item.value">
                    <span class="text-vertical-center">{{ item.name }}</span>
                </div>
            </div>

            <!-- Select Calendar -->
            <div class="select-calendar">

                <div>
                    <label>Tần suất</label>
                    <select v-model="frequency_selected">
                        <option v-for="(item, index) in frequency" :key="index" :value="item.value">
                            {{ item.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label>Chọn thời gian nhắc lịch</label>
                    <date-picker class="date-picker" v-model="date_picker" valueType="timestamp" :type="type_date_picker"
                        :shortcuts="shortcuts" :format="date_picker_format" :open.sync="open_calendar" :time-picker-options="{
                            start: '00:00',
                            step: '00:30',
                            end: '23:30',
                        }" :show-week-number="show_week_number">
                    </date-picker>
                </div>
            </div>

            <!-- Button  -->
            <div class="button">

                <div class="btn btn-update label-orange" @click="updateNote()">
                    {{ $t('update') }}
                </div>

                <div class="btn btn-update label-black" @click="showRemoveNote()">
                    {{ $t('remove') }}
                </div>


            </div>

        </div>

    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import Resful from '@/services/resful.js'

export default {
    name: "DashBoard",
    components: {
        DatePicker,
    },
    data() {
        return {
            input_content: '',
            time_tabs: [
                {
                    name: this.$t('30_minute'),
                    value: '30_minute'
                },
                {
                    name: this.$t('2_hours'),
                    value: '2_hours'
                },
                {
                    name: this.$t('9:00_tomorrow'),
                    value: '9:00_tomorrow'
                },
                {
                    name: this.$t('other'),
                    value: 'other'
                },
            ],
            time_selected: '',
            date_picker: null,
            date_picker_format: 'HH:mm DD/MM/YYYY',
            type_date_picker: 'datetime',
            time_picker_option: null,
            open_calendar: false,
            show_week_number: true,
            frequency: [
                {
                    name: this.$t('dont_repeat'),
                    value: 'NONE'
                },
                {
                    name: this.$t('every_day'),
                    value: 'EVERY_DAY'
                },
                {
                    name: this.$t('evrery_week'),
                    value: 'EVERY_WEEk'
                },
                {
                    name: this.$t('every_month'),
                    value: 'EVERY_MONTH'
                }
            ],
            frequency_selected: 'NONE',
            shortcuts: [],
            type_date_picker: 'datetime',
            open_modal: false,
            schedule_labels: [
                {
                    name: this.$t('all'),
                    value: ''
                },
                {
                    name: this.$t('note'),
                    value: 'note'
                },
                {
                    name: this.$t('appointment_reminder'),
                    value: 'appointment_reminder'
                },
                {
                    name: this.$t('support'),
                    value: 'support'
                },
                {
                    name: this.$t('meeting'),
                    value: 'meeting'
                },
                {
                    name: this.$t('leave_the_office'),
                    value: 'leave_the_office'
                },
                {
                    name: this.$t('email'),
                    value: 'email'
                },
            ],
            schedule_selected: '',
            note_list: [],
            item_edit: {},
            is_show_edit: false,
            access_token: ''
        }
    },
    mounted() {
        this.getNoteList()
        this.listenParentEvent()
    },
    watch: {
        frequency_selected: function (val) {
            if (val == 'NONE') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm DD/MM/YYYY'
            }
            if (val == 'EVERY_DAY') {
                this.type_date_picker = 'time'
                this.date_picker_format = 'HH:mm a'
            }
            if (val == 'EVERY_WEEk') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm dddd'
            }
            if (val == 'EVERY_MONTH') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm DD/MM/YYYY'
            }
        },
        time_selected(val) {

            this.frequency_selected = 'NONE'

            if (val === '30_minute') {
                this.date_picker = Date.now() + (30 * 60 * 1000)
            }

            if (val === '2_hours') {
                this.date_picker = Date.now() + (2 * 60 * 60 * 1000)
            }

            if (val === '9:00_tomorrow') {

                var d = new Date();
                d.setDate(d.getDate() + 1);
                d.setHours(9, 0, 0);
                d.setMilliseconds(0);

                this.date_picker = new Date(d).getTime()
            }

            if (val === 'other') {
                this.open_calendar = true
                this.date_picker = Date.now()
            }
        }
    },
    methods: {
        onInput(e) {
            if (e && e.target && e.target.innerText) {
                this.input_content = e.target.innerText
            }
        },
        getNoteList() {
            let body = {
                label: this.schedule_selected
            }
            if (!body.label) delete body.label

            Resful.post(
                {
                    access_token: window.access_token || '',
                    body,
                    path: '/v1/note/read'
                },
                (e, r) => {

                    if (e) return console.log(e)

                    this.note_list = r.data.data.map(item => {

                        this.schedule_labels.map(item1 => {
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
        },
        showEdit(item) {
            this.item_edit = item
            this.is_show_edit = true
            document.getElementById('content').innerHTML = item.content;
            this.input_content = item.content
            this.frequency_selected = item.frequency
            this.date_picker = item.schedule_time
            this.watchNote()
        },
        updateNote() {

            if (!this.input_content) return

            Resful.post(
                {
                    access_token: window.access_token || '',
                    body: {
                        "_id": this.item_edit._id,
                        "label": this.label_selected,
                        "content": this.input_content,
                        "schedule_time": this.date_picker,
                        "frequency": this.frequency_selected
                    },
                    path: '/v1/note/update'
                },
                (e, r) => {
                    if (e) return console.log(e)
                    document.getElementById('content').innerHTML = "";
                    this.input_content = ''
                    this.date_picker = null
                    this.time_selected = null

                    this.is_show_edit = false
                    this.getNoteList()

                    this.$toasted.success(this.$t('update_sucess'), {
                        duration: 5000
                    });
                }
            )
        },
        showRemoveNote() {
            this.$toasted.show(this.$t('question_remove'), {
                type: "info",
                theme: "outline",
                duration: 10000,
                action: [
                    {
                        text: this.$t('cancel'),
                        onClick: (e, toastObject) => {
                            toastObject.goAway(0);
                        }
                    },
                    {
                        text: this.$t('confirm'),
                        onClick: (e, toastObject) => {
                            toastObject.goAway(0);
                            this.removeNote()
                        }
                    }
                ]
            })
        },
        removeNote() {

            Resful.post(
                {
                    access_token: window.access_token || '',
                    body: {
                        "_id": this.item_edit._id,
                        "is_remove": true
                    },
                    path: '/v1/note/update'
                },
                (e, r) => {
                    if (e) return console.log(e)
                    document.getElementById('content').innerHTML = "";
                    this.input_content = ''
                    this.date_picker = null
                    this.time_selected = null

                    this.is_show_edit = false
                    this.getNoteList()
                }
            )
        },
        watchNote() {
            Resful.post(
                {
                    access_token: window.access_token || '',
                    body: {
                        "_id": this.item_edit._id,
                        "watched": true
                    },
                    path: '/v1/note/update'
                },
                (e, r) => {
                    if (e) return console.log(e)
                }
            )
        },
        showTimeMore(value) {
            if (!value) return ''
            if (value < Date.now()) return ''

            var seconds = Math.floor((value - Date.now()) / 1000);

            var interval = seconds / 31536000;

            if (interval > 1) {
                return Math.floor(interval) + " " + this.$t('year_more');
            }

            interval = seconds / 2592000;

            if (interval > 1) {
                return Math.floor(interval) + " " + this.$t('month_more');
            }

            interval = seconds / 86400;

            if (interval > 1) {
                return Math.floor(interval) + " " + this.$t('day_more');
            }

            interval = seconds / 3600;

            if (interval > 1) {
                return Math.floor(interval) + " " + this.$t('hour_more');
            }

            interval = seconds / 60;

            if (interval > 1) {
                return Math.floor(interval) + " " + this.$t('minute_more');
            }

            return Math.floor(seconds) + " " + this.$t('second_more');
        },
        listenParentEvent() {
            try {
                
                const _this = this
                
                // * Lắng nghe event message từ parent
                window.addEventListener('message', function (event) {
                    if (event &&
                        event.data &&
                        event.data.type &&
                        event.data.from &&
                        event.data.from === 'CHATBOX' &&
                        event.data.payload
                    ) {
                        // * Phân loại event type
                        switch (event.data.type) {
                            case 'RELOAD':

                                // * Ghi đè lại access_token
                                window.access_token = event.data.payload[
                                    'access_token'
                                ] || ''

                                console.log(
                                    "window.access_token", 
                                    window.access_token
                                )

                                // * Lấy danh sách note mới
                                _this.getNoteList()

                                break;
                            default: console.log("EVENT_TYPE_INVALID")
                                break;
                        }
                    }
                });
            } catch (error) { console.log("listenParentEvent", error) }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.labels {

    overflow: auto;

    .label-primary {
        white-space: nowrap;
        margin-right: 10px;
    }
}

.staff-info {
    display: flex;

    img {
        border-radius: 100%;
        width: 30px;
    }
}
.empty {
    width: 100%;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
        width: 100px;
    }
    
    p {
        color: gray;
    }
}
</style>
