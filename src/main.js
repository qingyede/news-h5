import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.less'
import vant from 'vant'
import '@/assets/fonts/icomoon.eot'
import '@/assets/fonts/icomoon.svg'
import '@/assets/fonts/icomoon.ttf'
import '@/assets/fonts/icomoon.woff'
import '@/assets/style.css'

Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
