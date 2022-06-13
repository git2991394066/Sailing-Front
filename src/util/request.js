import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'


//创建axios请求
let service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  timeout: 5000
})
//配置可以跨域传递cookie
service.defaults.withCredentials = true
//请求拦截
//【JWT】4、请求时，带上token
service.interceptors.request.use(
  (request) => {
    //将token添加到请求头
    if (request.url !== '/account/login' && request.url !== '/account/register') {
      let currentUser = JSON.parse(window.localStorage.getItem('current-user'))
      request.headers['Authorization'] = currentUser.token
    }

    return request
  },
  (error) => {
    //错误时拦截
    console.log(error)
    return Promise.reject(error)
  }
)

//响应拦截
service.interceptors.response.use(
  config => {
    return config
  },
  error=>{
    //后端一共返回非正常的HTTP状态码，分别为401、403和996，前端都在此处处理
    switch(error.response.status){
      case 401:
        Message({
          message: error.response.data.message,
          type: 'warning',
          duration: 5 * 1000
        })
        //清除登录信息
        window.localStorage.removeItem('current-user')
        //跳转
        router.push('/login')
        break
      case 403:
        Message({
          message:error.response.data.message,
          type:'warning',
        })
        break
      case 996:
        Message({
          message:error.response.data.message,
          type:'warning',
        })
        break
      default:
        Message({
          message:'返回异常：'+error.response.data.message,
          type:'erorr',
        })
        break
    }
    return
  }
)

export default service

