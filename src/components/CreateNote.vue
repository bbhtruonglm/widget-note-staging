<template>
  <div class="text-sm flex flex-col gap-2.5">
    <div class="flex gap-2 justify-end cursor-pointer">
      <div class="flex gap-2 w-fit" @click="toogle_remind">
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
        <label class="text-xs">{{ $t("frequency") }}</label>
        <select
          v-model="frequency_selected"
          class="border-2 px-3 rounded outline-none h-full"
        >
          <option
            v-for="(item, index) in frequency"
            :key="index"
            :value="item.value"
            class="text-black"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Button  -->
    <div class="w-full flex gap-2 items-center text-black font-medium">
      <div
        class="w-1/4 text-center cursor-pointer hover:font-bold"
        @click="toogle_modal()"
      >
        {{ $t("close") }}
      </div>
      <div
        class="w-3/4 text-center text-white py-2 rounded-md cursor-pointer hover:shadow-md hover:shadow-black/20"
        :class="input_content ? 'bg-orange-600' : 'bg-gray-400'"
        @click="create_new_note()"
      >
        {{ $t("save") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/locale/vi";
import {Resful} from "@/services/resful.js";

let url_string = window.location.href;
let url = new URL(url_string);
let access_token = url.searchParams.get("access_token");
// let secret_key = "0cf5516973a145929ff36d3303183e5f";
let secret_key = globalThis?.$env?.secret_key;
export default {
  name: "CreateNote",
  props: ["input_content"],
  emits: ["update:input_content", "changeTab"],
  components: {DatePicker},
  created() {
    // TODO remove with sdk
    Resful.chatbox_post(
      "https://chatbox-app.botbanhang.vn/v1/service/partner-authenticate",
      {
        access_token,
        secret_key,
      },
      (e: any, r: any) => {
        if (e) return console.log(e);
        this.staff_data = r.data.data.public_profile;
        this.placeholder = `${this.$t("input_content")} ${
          this.staff_data?.client_name
        }`;
        console.log("widget note user info", this.staff_data);
      }
    );
  },
  data() {
    return {
      lables: [
        {
          name: this.$t("note"),
          value: "note",
        },
        {
          name: this.$t("appointment_reminder"),
          value: "appointment_reminder",
        },
        {
          name: this.$t("support"),
          value: "support",
        },
        {
          name: this.$t("meeting"),
          value: "meeting",
        },
        {
          name: this.$t("leave_the_office"),
          value: "leave_the_office",
        },
        {
          name: this.$t("email"),
          value: "email",
        },
      ],
      label_selected: "note",
      // input_content: "",
      time_tabs: [
        {
          name: this.$t("30_minute"),
          value: "30_minute",
        },
        {
          name: this.$t("2_hours"),
          value: "2_hours",
        },
        {
          name: this.$t("9:00_tomorrow"),
          value: "9:00_tomorrow",
        },
        {
          name: this.$t("other"),
          value: "other",
        },
      ],
      time_selected: "",
      date_picker: null as any,
      date_picker_format: "HH:mm DD/MM/YYYY",
      type_date_picker: "datetime",
      time_picker_option: null,
      open_calendar: false,
      shortcuts: [],
      show_week_number: true,
      frequency: [
        {
          name: this.$t("dont_repeat"),
          value: "NONE",
        },
        {
          name: this.$t("every_day"),
          value: "EVERY_DAY",
        },
        {
          name: this.$t("evrery_week"),
          value: "EVERY_WEEk",
        },
        {
          name: this.$t("every_month"),
          value: "EVERY_MONTH",
        },
      ],
      frequency_selected: "NONE",
      open_modal: false,
      staff_data: {} as {[key: string]: string},
      placeholder: this.$t("input_content"),
      is_remind: false,
    };
  },
  mounted() {
    this.listenParentEvent();
  },
  watch: {
    frequency_selected: function (val) {
      if (val == "NONE") {
        this.type_date_picker = "datetime";
        this.date_picker_format = "HH:mm DD/MM/YYYY";
      }
      if (val == "EVERY_DAY") {
        this.type_date_picker = "time";
        this.date_picker_format = "HH:mm a";
        this.date_picker = Date.now();
      }
      if (val == "EVERY_WEEk") {
        this.type_date_picker = "datetime";
        this.date_picker_format = "HH:mm dddd";
        this.date_picker = Date.now();
      }
      if (val == "EVERY_MONTH") {
        this.type_date_picker = "datetime";
        this.date_picker_format = "HH:mm DD/MM/YYYY";
        this.date_picker = Date.now();
      }
    },
    time_selected(val) {
      this.frequency_selected = "NONE";

      if (val === "30_minute") {
        this.date_picker = Date.now() + 30 * 60 * 1000;
      }

      if (val === "2_hours") {
        this.date_picker = Date.now() + 2 * 60 * 60 * 1000;
      }

      if (val === "9:00_tomorrow") {
        var d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0);
        d.setMilliseconds(0);

        this.date_picker = new Date(d).getTime();
      }

      if (val === "other") {
        this.open_calendar = true;
        this.date_picker = Date.now();
      }
    },
  },
  methods: {
    // onInput(e: any) {
    //   if (e && e.target && e.target.innerText) {
    //     this.input_content = e.target.innerText;
    //   }
    // },
    create_new_note() {
      if (!this.input_content) return;
      // [x] remove with sdk
      Resful.post(
        {
          access_token: window.access_token || access_token,
          body: {
            label: this.label_selected,
            content: this.input_content,
            schedule_time: this.date_picker,
            frequency: this.frequency_selected,
            fb_staff_id: this.staff_data.current_staff_id,
            staff_name: this.staff_data.current_staff_name,
          },
          path: "/v1/note/create",
        },
        (e: any) => {
          if (e) return console.log(e);
          let content = document.getElementById("content");
          if (content) content.innerHTML = "";
          // this.input_content = "";
          this.$emit("update:input_content", "");
          this.date_picker = null;
          this.time_selected = "";
          this.$emit("changeTab", "NOTE_LIST");
          // this.$toasted.success(this.$t("create_new_success"), {
          //   duration: 1000,
          // });
        }
      );
    },
    toogle_modal() {
      // if (this.open_modal) return (this.open_modal = false);
      // if (!this.open_modal) return (this.open_modal = true);
      // this.$emit("showListEmployees");
      this.$emit("update:input_content", "");
      this.$emit("changeTab", "NOTE_LIST");
    },
    getUserInfo() {
      Resful.chatbox_post(
        "https://chatbox-app.botbanhang.vn/v1/service/partner-authenticate",
        {
          access_token: window.access_token,
          secret_key,
        },
        (e: any, r: any) => {
          if (e) return console.log(e);
          this.staff_data = r.data.data.public_profile;
          this.placeholder = `${this.$t("input_content")} ${
            this.staff_data.client_name
          }`;
          console.log("widget note user info", this.staff_data);
        }
      );
    },
    listenParentEvent() {
      try {
        const _this = this;

        // * Lắng nghe event message từ parent
        window.addEventListener("message", function (event) {
          if (
            event &&
            event.data &&
            event.data.type &&
            event.data.from &&
            event.data.from === "CHATBOX" &&
            event.data.payload
          ) {
            // * Phân loại event type
            switch (event.data.type) {
              case "RELOAD":
                // * Ghi đè lại access_token
                window.access_token = event.data.payload["access_token"] || "";
                // console.log(
                //   "window.access_token widget note",
                //   window.access_token
                // );

                _this.getUserInfo();

                break;
              default:
                console.log("EVENT_TYPE_INVALID");
                break;
            }
          }
        });
      } catch (error) {
        console.log("listenParentEvent", error);
      }
    },
    toogle_remind() {
      this.is_remind = !this.is_remind;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.labels {
  overflow: auto;

  .label-primary {
    white-space: nowrap;
    margin-right: 10px;
  }
}
$namespace: "xmx"; // change the 'mx' to 'xmx'. then <date-picker prefix-class="xmx" />

$default-color: #555;
$primary-color: #f55600;

@import "vue-datepicker-next/scss/index.scss";
</style>
