// Import vue
import {createApp} from "vue";
import App from "./App.vue";
import WIDGET from "bbh-chatbox-widget-js-sdk";
import "./style.css";
// import "./custom.scss";
import {loadLanguage} from "./services/language";
import {loadEnv} from "./services/core/env";

// Vue.config.productionTip = false;

const APP = createApp(App);
async function startApp() {
  try {
    loadLanguage(APP);
    await loadEnv();
    WIDGET.load(globalThis.$env.secret_key);
    APP.mount("#app");
  } catch (error) {
    console.error("Error starting app:", error);
  }
}

startApp();
