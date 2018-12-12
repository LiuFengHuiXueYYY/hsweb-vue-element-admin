import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/role',
    method: 'get',
    params:params
  })
}
export function roleAdd(params) {
  return request({
    url: '/role',
    method: 'post',
    data:params
  })
}
export function roleUpdate(params) {
  return request({
    url: '/role/' + params.id,
    method: 'put',
    data:params
  })
}
