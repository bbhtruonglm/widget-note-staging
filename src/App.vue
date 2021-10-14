<template>
    <div id="app">
        <DashBoard v-if="!active_app" />
        <ActiveWidget v-if="active_app" />
    </div>
</template>

<script>
import DashBoard from "./components/DashBoard.vue";
import ActiveWidget from "./components/ActiveWidget.vue"
import Resful from '@/services/resful.js'

let url_string = window.location.href
let url = new URL(url_string);
let access_token = url.searchParams.get("access_token");
let secret_key = '0cf5516973a145929ff36d3303183e5f'

export default {
    name: "App",
    components: {
        DashBoard,
        ActiveWidget
    },
    data() {
        return {
            active_app: false
        };
    },
    mounted() {
        Resful.chatbox_post(
            'https://chatbox-app.botbanhang.vn/v1/service/partner-authenticate',
            {
                access_token,
                secret_key
            },
            (e, r) => {
                if(e) return this.active_app = true
                this.active_app = false
            }
        )
    },
    methods: {

    }
};
</script>

<style lang="scss">
#app {
  font-family: Arial;
}
</style>
