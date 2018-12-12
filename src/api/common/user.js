import request from '@/utils/request'

export function userList(params) {
  return request({
    url: '/user',
    method: 'get',
    params:params
  })
}
export function userById(params) {
  return request({
    url: '/user/' + params.id,
    method: 'get',
    params:params
  })
}
export function userUpdate(params) {
  return request({
    url: '/user/' + params.id,
    method: 'put',
    data:params
  })
}
export function userAdd(params) {
  return request({
    url: '/user',
    method: 'post',
    data:params
  })
}
