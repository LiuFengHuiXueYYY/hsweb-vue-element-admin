import request from '@/utils/request'

export function menuTree(params) {
  return request({
    url: '/menu?paging=false',
    method: 'get',
    params: params
  })
}
export function menuDelete(params) {
  return request({
    url: '/menu/' + params.id,
    method: 'delete'
  })
}
export function menuUserTree(params) {
  return request({
    url: '/menu/user-own/tree',
    method: 'get',
    params: params
  })
}
export function menuAddOrUpdate(row) {
  let params = rowToObj(row)
  return request({
    url: '/menu',
    method: 'PATCH',
    data: params
  })
}

function rowToObj(row) {
  let params = {}
  let menu
  if (row.menu) {
    menu = row.menu
      //params.children = menu.children
  } else {
    menu = row
  }
  params.name = menu.name
  params.id = menu.id
  params.describe = menu.describe
  params.permissionId = menu.permissionId
  params.url = menu.url
  params.icon = menu.icon
  params.status = menu.status
  params.parentId = menu.parentId
  params.sortIndex = menu.sortIndex
  if (row.children) {
    params.children = []
    row.children.forEach(function(val) {
      params.children.push(rowToObj(val))
    })
  }
  return params
}
