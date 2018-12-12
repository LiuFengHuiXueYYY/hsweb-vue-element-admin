import request from '@/utils/request'

export function companyList(params) {
  return request({
    url: '/company/list',
    method: 'get',
    params: params
  })
}

export function companyUpdate(params) {
  return request({
    url: '/company/update',
    method: 'put',
    data: params
  })
}

export function companyAdd(params) {
  return request({
    url: '/company/add',
    method: 'post',
    data: params
  })
}
