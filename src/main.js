import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.use(ElementUI)
Vue.config.productionTip = false

// 给axios配置 跟路径
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// axios的请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 给axios配置token
    var token = window.sessionStorage.getItem('token')
    // 判断 token s是否存在
    if (token !== null) {
      // 把token 放进请求头里 让axios带着去后端
      config.headers.Authorization = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 给axios配置成为Vue的成员
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
