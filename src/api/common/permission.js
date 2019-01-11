import request from '@/utils/request'
export function permissionList(params) {
  return request({
    url: '/permission',
    method: 'get',
    params: params
  })
}
export function permissionAll() {
  return request({
    url: '/permission?paging=false',
    method: 'get'
  })
}

export function permissionAdd(params) {
  return request({
    url: '/permission',
    method: 'post',
    data: params
  })
}

export function permissionUpdate(params) {
  return request({
    url: '/permission/' + params.id,
    method: 'put',
    data: params
  })
}

export function permissionDelete(params) {
  return request({
    url: '/permission/' + params.id,
    method: 'DELETE'
  })
}
