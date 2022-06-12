import request from "@/util/request"

//登录
export function login(user) {
  return request({
    url: '/account/login',
    method: 'post',
    data: user
  })
}