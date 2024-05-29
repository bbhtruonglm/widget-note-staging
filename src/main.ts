// Import vue
import { createApp } from "vue";
import App from "./App.vue";

import "./style.css";
// import "./custom.scss";
import { loadLanguage } from "./services/language";

// Vue.config.productionTip = false;

const APP = createApp(App);
function startApp() {
    try {
        loadLanguage(APP);
        APP.mount("#app");
    } catch (error) {
        console.error("Error starting app:", error);
    }
}

startApp();
