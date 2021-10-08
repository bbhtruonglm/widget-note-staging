// Import vue
import Vue from 'vue'
import App from './App.vue'

// * Import css
// import './../libraries/css/normalize.css'
// import './../libraries/css/skeleton.css'
import './../libraries/css/custom.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
