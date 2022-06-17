const currentProjectKey = 'current-user-project'

//通用的
export function set(key, value) {
  window.localStorage.setItem(key, value)
}

export function get(key) {
  return window.localStorage.getItem(key)
}

export function remove(key) {
  window.localStorage.removeItem(key)
}
//获取当前项目快捷的使用
export function getCurrentProject() {
  return this.get(currentProjectKey)
}

export function setCurrentProject(currentProject) {
  this.set(currentProjectKey, currentProject)
}

export function removeCurrentProject() {
  this.remove(currentProjectKey)
}