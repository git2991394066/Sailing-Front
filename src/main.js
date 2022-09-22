import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-ui，需要先npm install element-ui安装
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入echarts，需要先npm install echarts安装
import * as echarts from 'echarts'
//导入自定义的样式
import '@/assets/css/icon.css';
import dofilters from '@/util/dofilters';

for (let key in dofilters) {
    Vue.filter(key, dofilters[key]);
}
Vue.config.productionTip = false
//添加ElementUI
Vue.use(ElementUI)
//全局注册，使用方法为:this.$echarts
Vue.prototype.$echarts = echarts

// 格式化百分比显示
Vue.filter('percent', function (data) {
  var result = Math.round(data * 10000);
  return result / 100 + "%"
})
new Vue({
  router,
  store,
  dofilters,
  render: h => h(App)
}).$mount('#app')
