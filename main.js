import App from './App'


// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif
import uviewPlus from '@/uni_modules/uview-plus'

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia)
  app.use(uviewPlus)
  return {
    app,
	pinia,
  };
}
// #endif