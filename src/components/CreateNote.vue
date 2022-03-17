<template>
    <!-- Create tabs -->
    <div>
        <!-- Label -->
        <div class="labels padding-bottom">
            <div v-for="(item, index) in lables" 
                :key="index" 
                class="label-primary label-gray"
                :class="{'label-black': item.value === label_selected}"
                @click="label_selected = item.value"
            >
                <span class="text-vertical-center">{{item.name}}</span>
            </div>
        </div>

        <!-- Input -->
        <div class="input-content">

            <div class="input-flex">
                <div
                    id="content"
                    contenteditable="plaintext-only" 
                    :placeholder="$t('input_content')" 
                    class="chat-input-text"
                    @input="onInput"
                >
                </div>
            </div>

        </div>

        <!-- Fast Time Select  -->
        <div class="time-select">

            <div class="title">
                {{ $t('fast_select') }}
            </div>

            <!-- <div class="alert-before">
                Báo trước: <span class="text-orange">15 phút</span>
                <img src="./../assets/right_arrow.svg" alt="">
            </div> -->

        </div>

        <!-- Time label -->
        <div class="time-labels">
            <div v-for="(item, index) in time_tabs" 
                :key="index" 
                class="label-primary"
                :class="{'label-orange': item.value === time_selected}"
                @click="time_selected = item.value"
            >
                <span class="text-vertical-center">{{item.name}}</span>
            </div>
        </div>

        <!-- Select Calendar -->
        <div class="select-calendar">

            <div>
                <label>{{ $t('frequency') }}</label>
                <select v-model="frequency_selected">             
                    <option 
                        v-for="(item, index) in frequency" :key="index"
                        :value="item.value"
                    >
                        {{item.name}}
                    </option>
                </select>
            </div>

            <div>
                <label>Chọn thời gian nhắc lịch</label>
                <date-picker 
                    class="date-picker" 
                    v-model="date_picker" 
                    valueType="timestamp"
                    :type="type_date_picker"
                    :shortcuts="shortcuts"
                    :format="date_picker_format"
                    :open.sync="open_calendar"
                    :show-week-number="show_week_number"
                >
                </date-picker>
            </div>
        </div>

        <!-- Button  -->
        <div class="button">

            <div class="btn btn-script label-black" @click="toogle_modal()">   
                {{ $t('script') }}
            </div>

            <div class="btn btn-save label-orange"
                @click="create_new_note()"
            >
                {{ $t('save') }}
            </div>
        </div>

        <!-- Scrip Modal -->
        <div class="script_modal" v-show="open_modal">
            <div class="header">
                <div>
                    {{ $t('choose_script') }}
                </div>
                <img @click="open_modal = false" src="./../assets/close.svg" alt="">
            </div>

            <!-- <div class="script-list">

                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>

                <div class="label-primary label-black">
                    Chọn
                </div>

            </div>

            <div class="script-list">
                
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>

                <div class="label-primary label-orange">
                    Đã chọn
                </div>

            </div> -->

            <div class="script-empty">
                {{ $t('no_script') }}
                "<span class="text-bold">{{ $t('appointment_reminder') }}</span>" 
                {{ $t('on_pc') }} 
                <span class="text-orange">({{ $t('see_the_instructions') }})</span>
            </div>

        </div>

    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import Resful from '@/services/resful.js'

let url_string = window.location.href
let url = new URL(url_string);
let access_token = url.searchParams.get("access_token");
let secret_key = '0cf5516973a145929ff36d3303183e5f'

export default {
    name: "CreateNote",
    components: { DatePicker },
    created() {
        Resful.chatbox_post(
            'https://chatbox-app.botbanhang.vn/v1/service/partner-authenticate',
            {
                access_token,
                secret_key
            },
            (e, r) => {
                if(e) return console.log(e)
                this.staff_data = r.data.data.conversation_staff.snap_staff
                console.log("aaaaa", this.staff_data)
            }
        )
    },
    data() {
        return {
            lables : [
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
            label_selected: 'note',
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
            shortcuts: [],
            show_week_number: true,
            frequency: [
                {
                    name : this.$t('dont_repeat'),
                    value: 'NONE'
                },
                {
                    name : this.$t('every_day'),
                    value: 'EVERY_DAY'
                },
                {
                    name : this.$t('evrery_week'),
                    value: 'EVERY_WEEk'
                },
                {
                    name : this.$t('every_month'),
                    value: 'EVERY_MONTH'
                }
            ],
            frequency_selected: 'NONE',
            open_modal: false,
            staff_data: {}
        }
    },
    watch: {
        frequency_selected: function(val) {
            if(val == 'NONE') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm DD/MM/YYYY'
            }
            if(val == 'EVERY_DAY') {
                this.type_date_picker = 'time'
                this.date_picker_format = 'HH:mm a'
                this.date_picker = Date.now()
            }
            if(val == 'EVERY_WEEk') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm dddd'
                this.date_picker = Date.now()
            }
            if(val == 'EVERY_MONTH') {
                this.type_date_picker = 'datetime'
                this.date_picker_format = 'HH:mm DD/MM/YYYY'
                this.date_picker = Date.now()
            }
        },
        time_selected(val) {

            this.frequency_selected = 'NONE'

            if(val === '30_minute') {
                this.date_picker = Date.now() + (30 * 60 * 1000)
            }

            if(val === '2_hours') {
                this.date_picker = Date.now() + (2 * 60 * 60 * 1000)
            }

            if(val === '9:00_tomorrow') {

                var d = new Date();
                d.setDate(d.getDate() + 1);
                d.setHours(9, 0, 0);
                d.setMilliseconds(0);

                this.date_picker = new Date(d).getTime()
            }

            if(val === 'other') {
                this.open_calendar = true
                this.date_picker = Date.now()
            }
        }
    },
    methods: {
        onInput(e) {
            if(e && e.target && e.target.innerText) {
                this.input_content = e.target.innerText
            }
        },
        create_new_note() {

            if(!this.input_content) return

            Resful.post(
                '/v1/note/create',
                {
                    "label": this.label_selected,
                    "content": this.input_content,
                    "schedule_time": this.date_picker,
                    "frequency" : this.frequency_selected,
                    "fb_staff_id": this.staff_data.fb_staff_id,
                    "staff_name": this.staff_data.name
                },
                (e, r) => {
                    if(e) return console.log(e)

                    document.getElementById('content').innerHTML = "";
                    this.input_content = ''
                    this.date_picker = null
                    this.time_selected = null

                    this.$toasted.success(this.$t('create_new_success'),{
                        duration:5000
                    });
                }
            )
        },
        toogle_modal() {
            if(this.open_modal) return this.open_modal = false
            if(!this.open_modal) return this.open_modal = true
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

</style>
