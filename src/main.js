import Vue from 'vue'
import App from './App'
import router from './router'

// 导入 ElementUI组件库
import ElementUI from 'element-ui'
// 导入ElementUI的样式
// import 'element-ui/lib/theme-chalk/index.css'

// 导入公共样式
import '@/assets/common.css'

// 1. 把axios绑定到Vue的原型上
import axios from 'axios'

// 导入element-tree-grid插件, 导入的就是一个别人定义好的组件
import ElTreeGrid from 'element-tree-grid'

// 导入moment函数
import moment from 'moment'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入相关的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 注册富文本编辑器插件
Vue.use(VueQuillEditor)

// 注册一个全局的组件
// el-table-tree-column
// console.log('el-table-tree-column', ElTreeGrid)
Vue.component(ElTreeGrid.name, ElTreeGrid)

Vue.prototype.axios = axios

// 定义全局过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 2. 配置axios的全局的默认baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 3. 配置axios的拦截器
// 拦截器：当发送axios请求的时候，首先会经过这个拦截器
// 请求拦截器： 拦截请求
// 响应拦截器： 拦截响应
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // console.log('haha ,请求被我拦截到了把', config)
    // config.headers.aa = 'bb'
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    // console.log('拦截到了响应', res)
    // 直接返回res.data，对应的就是服务器返回的数据
    return res.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 使用elementUI这个插件
Vue.use(ElementUI)

Vue.config.productionTip = false

// 禁用eslint的no-new的规则
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
