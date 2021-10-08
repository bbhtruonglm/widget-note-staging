<template>
    <div class="container">

        <!-- Tabs -->
        <div class="tabs">
            <div class="btn"
                v-for="(item, index) in tabs"
                :key="index"
                :class="{'label-orange': item.name === tab_selected}"
                @click="tab_selected = item.name"
            >
                {{item.name}}
            </div>
        </div>

        <!-- Create tabs -->
        <div v-show="tab_selected === tabs[0].name">

            <!-- Label -->
            <div class="labels">
                <div v-for="(item, index) in lables" 
                    :key="index" 
                    class="label-primary label-gray"
                    :class="{'label-black': item.name === label_selected}"
                    @click="label_selected = item.name"
                >
                    <span class="text-vertical-center">{{item.name}}</span>
                </div>
            </div>

            <!-- Input -->
            <div class="input-content">

                <div class="input-flex">
                    <div
                        contenteditable="plaintext-only" 
                        placeholder="Nhập nội dung ghi chú ..." 
                        class="chat-input-text"
                        @input="onInput"
                    >
                    </div>
                </div>

            </div>

            <!-- Fast Time Select  -->
            <div class="time-select">

                <div class="title">
                    Chọn nhanh
                </div>

                <div class="alert-before">
                    Báo trước: <span class="text-orange">15 phút</span>
                    <img src="./../assets/right_arrow.svg" alt="">
                </div>

            </div>

            <!-- Time label -->
            <div class="time-labels">
                <div v-for="(item, index) in time_tabs" 
                    :key="index" 
                    class="label-primary"
                    :class="{'label-orange': item.name === time_selected}"
                    @click="time_selected = item.name"
                >
                    <span class="text-vertical-center">{{item.name}}</span>
                </div>
            </div>

            <!-- Select Calendar -->
            <div class="select-calendar">
                <div>
                    <label>Tần suất</label>
                    <select>             
                        <option v-for="(item, index) in frequency" :key="index">
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
                        type="date"
                        :shortcuts="shortcuts"
                    >
                    </date-picker>
                </div>
            </div>

            <!-- Button  -->
            <div class="button">

                <div class="btn btn-script label-black" @click="open_modal = true">   
                    Kịch bản
                </div>

                <div class="btn btn-save label-orange">
                    Lưu
                </div>
            </div>

            <!-- Scrip Modal -->
            <div class="script_modal" v-show="open_modal">
                <div class="header">
                    <div>
                        Chọn kịch bản trả lời khách hàng tự động
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
                    Chưa có kịch bản, vui lòng truy cập chức năng "<span class="text-bold">Nhăc hẹn</span>" trên máy tính để tạo kịch bản trả lời khách hàng tự động. <span class="text-orange">(Xem hướng dẫn)</span>
                </div>

            </div>

        </div>

        <!-- schedule -->
        <div v-show="tab_selected === tabs[1].name">

            <!-- Label -->
            <div class="labels">
                <div v-for="(item, index) in schedule_labels" 
                    :key="index" 
                    class="label-primary label-gray"
                    :class="{'label-black': item.name === schedule_selected}"
                    @click="schedule_selected = item.name"
                >
                    <span class="text-vertical-center">{{item.name}}</span>
                </div>
            </div>

            <div class="schedule-list">

                <div class="time">
                    <span class="time-number">13:30 - 20/10/2021</span>
                    <span class="text-orange text-bold">1 tiếng nữa</span>
                </div>

                <div class="content">
                    <div class="label-primary label-gray">
                        <span>
                            Gọi điện
                        </span>
                    </div>
                    <div class="schedule-content">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>

            </div>

            <div class="schedule-list">

                <div class="time">
                    <span>13:30 - 20/10/2021 <span>(Đã xem)</span></span>
                    <span class="text-green text-bold">Đã kết thúc</span>
                </div>

                <div class="content">
                    <div class="label-primary label-gray">
                        <span>
                            Gọi điện
                        </span>
                    </div>
                    <div class="schedule-content">
                        <p class="line-through">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>

            </div>

            <div class="schedule-list">

                <div class="time">
                    <span>13:30 - 20/10/2021</span>
                    <span class="text-black text-bold">Xoá</span>
                </div>

                <div class="content">
                    <div class="label-primary label-gray">
                        <span>
                            Gọi điện
                        </span>
                    </div>
                    <div class="schedule-content">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>

            </div>

            <div class="schedule-list">

                <div class="time">
                    <span>13:30 - 20/10/2021 <span class="text-red text-bold">(Chưa xem)</span></span>
                    <span class="text-green text-bold">Đã kết thúc</span>
                </div>

                <div class="content">
                    <div class="label-primary label-gray">
                        <span>
                            Gọi điện
                        </span>
                    </div>
                    <div class="schedule-content">
                        <p class="line-through text-red">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
    name: "DashBoard",
    components: { DatePicker },
    data() {
        return {
            tabs: [
                {
                    name: 'Tạo mới',
                },
                {
                    name: 'Lịch hẹn đã lên'
                }
            ],
            tab_selected: 'Tạo mới',
            lables : [
                {
                    name: 'Ghi chú'
                },
                {
                    name: 'Nhắc hẹn'
                },
                {
                    name: 'Hỗ trợ'
                },
                {
                    name: 'Họp'
                },
                {
                    name: 'Rời văn phòng'
                },
                {
                    name: 'Email'
                },
            ],
            label_selected: 'Ghi chú',
            input_content: '',
            time_tabs: [
                {
                    name: '30 phút nữa',
                },
                {
                    name: '2 tiếng nữa',
                },
                {
                    name: '9:00 ngày mai',
                },
                {
                    name: 'Khác',
                },
            ],
            time_selected: '30 phút nữa',
            date_picker: Date.now(),
            frequency: [
                {
                    name : 'Không lặp lại'
                },
                {
                    name : 'Hàng ngày'
                },
                {
                    name : 'Hàng Tuần'
                },
                {
                    name : 'Hàng tháng'
                }
            ],
            shortcuts: [
                {
                    text: 'Today',
                    onClick() {
                        const date = new Date();
                        // return a Date
                        return date;
                    },
                },
                {
                    text: 'Yesterday',
                    onClick() {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        return date;
                    },
                },
            ],
            time_format: 'hh:mm:ss DD/MM/YYYY',
            open_modal: false,
            schedule_labels: [
                {
                    name: 'Toàn bộ'
                },
                {
                    name: 'Ghi chú'
                },
                {
                    name: 'Hỗ trợ'
                },
                {
                    name: 'Họp'
                },
                {
                    name: 'Rời văn phòng'
                },
                {
                    name: 'Email'
                },
            ],
            schedule_selected: 'Toàn bộ'
        }
    },
    methods: {
        onInput(e) {
            if(e && e.target && e.target.innerText) {
                this.input_content = e.target.innerText
            }
        }
    },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.container {
    padding: 8px;

    .tabs {

        width: 100%;
        height: 35px;

        div {
            width: 50%;
            float: left;
            height: 25px;
        }
    }

    .labels {

        width: 100%;
        height: 25px;
        display: flex;
        justify-content: space-between;
        margin-top: 10px

        div {
            height: 15px;
        }
    }

    .input-content {

        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        height: 52px;
        max-height: 105px;

        background: #EFF2F5;
        border: 1px solid #DFE1E4;
        box-sizing: border-box;
        border-radius: 5px;
        margin-top: 10px;

        .input-flex {
            flex: 1;
            overflow-y: scroll;
            padding: 5px;

            .chat-input-text:empty::before {
            content: attr(placeholder);
            pointer-events: none;
            display: block;
            color: rgba(0,0,0,.4);
            background-color: transparent;
            font-weight: 300;
            font-size: 14px;
            line-height: 22px;
        }

            .chat-input-text {
                width: 100%;
                max-height: 105px;
                outline: none;
                font-size: 14px;
            }

        }

    }

    .time-select {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        

        .title {
            font-size: 12px;
            color: #4F596A;
        }

        .alert-before {
            font-size: 10px;
            span {
                font-weight: 600;
            }
            
            img {
                margin-bottom: -2px;
                margin-left: 5px;
            }
        }
    }

    .time-labels {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;

        div {
            min-width: 60px;
            min-height: 24px;
        }
    }

    .select-calendar {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        div {
            width: 48%;

            label {
                font-size: 12px;
                color: #4F596A;
            }

            select {
                height: 30px;
                border: 1px solid #BCC0C6;
                border-radius: 5px;
                width: 100%;
                margin-top: 10px;

                option {
                    font-size: 12px;
                    color: #4F596A;
                }
            }

            .date-picker {
                height: 30px !important;
                width: 100%;
                margin-top: 10px;
            }
        }
    }

    .button {
        display: flex;
        justify-content: space-between;
        height: 40px;
        margin-top: 15px;

        .btn-script {
            width: 20%;
            font-weight: 500;
        }

        .btn-save {
            width: 75%;
        }
    }

    .script_modal {
        width: 348px;
        height: 250px;
        position: absolute;
        z-index: 1;
        margin: auto;
        background: #FFFFFF;
        border: 1px solid #DFE1E4;
        border-radius: 5px;
        top: 12px;
        padding: 5px;

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            div {
                font-size: 12px;
                font-weight: bold;
                color: #848B97;
            }
        }

        .script-list {
            margin: auto;
            width: 316px;
            height: 34px;
            border: 1px solid #DFE1E4;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding: 0 8px;
            justify-content: space-between;
            margin-bottom: 8px;

            p {
                margin: 0;
                font-size: 12px;
                color: #4F596A; 
                width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            div {
                height: 18px;
                width: 40px;
            }
        }

        .script-empty {
            width: 260px;
            height: 96px;
            font-size: 12px;
            margin: auto;
            padding: 5px;
            margin-top: 50px;

            .text-bold {
                font-weight: bold;
            }

            .text-orange {
                text-decoration: underline;
            }
        }
        
    }

    .schedule-list {
        margin-top: 10px;
        width: 95%;
        padding: 5px 10px;
        background: #EFF2F5;
        border: 1px solid #F2F2F2;
        border-radius: 5px 10px;


        .time{
            display: flex;
            justify-content: space-between;
            font-size: 10px;

            .time-number {
                font-weight: bold;
            }

        }

        .content {
            display: flex;
            margin-top: 8px;

            .label-primary {
                width: 45px;
                height: 18px;

                span {
                    width: 40px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                }
            }

            .schedule-content {
                font-size: 14px;
                color: #4F596A;
                margin-left: 10px;
                margin-top: 3px;

                p {
                    margin: 0;
                    width: 250px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                }
            }
        }
    }

}


</style>
