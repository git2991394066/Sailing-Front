import axios from "axios"
import { Message } from 'element-ui'
import router from '@/router'
import * as cookies from '@/util/cookies'
let request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000
}
)
//todo 跨域
//配置可以跨域传递cookie
request.defaults.withCredentials = true
//todo 请求拦截，广泛用在token形式每次请求添加token

//todo 响应拦截
request.interceptors.response.use(
  config => {
    return config
  },
  error => {
    //状态码为401，表示未登录，清除当前cookie，并跳转到登录页
    if (error.response.status === 401) {
      //清除cookie
      cookies.removeCurrentUser()
      //跳转到登录页
      router.push('/login')
      return
    }
    //状态码为996，表示数据验证异常，提示
    if (error.response.status === 996) {
      // //清除cookie
      // cookies.removeCurrentUser(),
      Message({
        message: error.response.data.message,
        type: 'warning',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '返回处理异常。' + error,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export default request