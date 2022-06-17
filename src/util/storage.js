/*
本地存储工具
*/
const currentUserProject = 'current-user-project'  //key

//通用操作
//新增
export function set(key,value){
    window.localStorage.setItem(key,JSON.stringify(value))
}
//获取
export function get(key){
    return JSON.parse(window.localStorage.getItem(key))
}
//移除
export function remove(key){
    window.localStorage.removeItem(key)
}

//当前项目操作
//获取
export function getCurrentProject() {
  return get(currentUserProject)
}
//设置
export function setCurrentProject(value) {
  set(currentUserProject, value)
}
//移除
export function removeCurrentProject() {
  remove(currentUserProject)
}