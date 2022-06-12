import request from '@/util/request'
// 分页查询
export function query(params) {
  return request({
    url: '/user/',
    method: 'get',
    params: params
  })
}
// 根据ID获取
export function getById(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}
// 创建
export function create(data) {
  return request({
    url: '/user/',
    method: 'post',
    data: data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/user/',
    method: 'put',
    data: data
  })
}
// 删除
export function remove(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}