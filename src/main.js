import Vue from 'vue'
import App from './App.vue'
import router from './router'
import storage from './plugins/storage'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
