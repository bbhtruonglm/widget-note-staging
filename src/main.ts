// Import vue
import { createApp } from 'vue'
import App from './App.vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import './style.css'
// import "./custom.scss";
import { loadLanguage } from './services/language'
import { loadEnv } from './services/core/env'
import { loadApp } from './services/core/app'

// Vue.config.productionTip = false;

const APP = createApp(App)
async function startApp() {
  try {
    // load i18n
    loadLanguage(APP)
    // load env
    await loadEnv()
    // cài secret key cho WIDGET
    WIDGET.load(globalThis.$env.secret_key)
    // dùng store
    loadApp(APP)
    APP.mount('#app')
  } catch (error) {
    console.error('Error starting app:', error)
  }
}

startApp()
