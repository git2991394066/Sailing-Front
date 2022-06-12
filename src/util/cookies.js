import vueCookies from 'vue-cookies'

const currentUserKey = 'current-user'
const expiredTime = '2h'
//通用的cookies操作封装
export function setCookie(key, value) {
  vueCookies.set(key, value, expiredTime)
}

export function getCookie(key) {
  return vueCookies.get(key)
}

export function removeCookie(key) {
  vueCookies.remove(key)
}
//封装常用方法
export function getCurrentUser() {
  return this.getCookie(currentUserKey)
}

export function setCurrentUser(currentUser) {
  this.setCookie(currentUserKey, currentUser)
}

export function removeCurrentUser() {
  this.removeCookie(currentUserKey)
}