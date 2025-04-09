import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入Element UI的组件库
import ElementUI from 'element-ui';

//导入Element UI的相关样式
import 'element-ui/lib/theme-chalk/index.css';

//将element-ui组件库挂载到Vue实例中
Vue.use(ElementUI);  


//全局引入Axios
import axios from 'axios';

//将axios挂载到Vue实例上
Vue.prototype.$http = axios


//全局引入全局样式文件
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
