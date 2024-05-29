<template>
  <div class="active-body">
    <div @click="active()" class="btn btn-active label-orange">Kích hoạt</div>
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
        (e: any, r: string) => {
          if (e) return console.log(e);
          alert(r);
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
