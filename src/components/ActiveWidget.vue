<template>
  <div class="active-body flex items-center justify-center h-screen">
    <div
      @click="active()"
      class="w-fit h-12 bg-orange-600 text-white flex items-center justify-center rounded-md px-5 cursor-pointer"
    >
      Kích hoạt
    </div>
  </div>
</template>

<script lang="ts">
import {Resful} from "../services/resful";

let url_string = window.location.href;
let url = new URL(url_string);
let token = url.searchParams.get("access_token");

export default {
  name: "ActiveWidget",
  data() {
    return {};
  },
  methods: {
    active() {
      Resful.chatbox_post(
        "https://chatbox-app.botbanhang.vn/v1/app/app-installed/update",
        {
          _type: "oauth-access-token",
          access_token: token,
          token_partner: "active",
        },
        (e: any, r: any) => {
          if (e) {
            alert("Kích hoạt không thành công thành công");
            console.log("oauth error", e);
          }
          console.log(r.data);

          if (r.data.code === 200) {
            alert("Kích hoạt thành công");
          }
          window.close();
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.active-body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .btn-active {
    width: 80px;
    height: 50px;
  }
}
</style>
