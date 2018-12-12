import request from '@/utils/request'

export function autzsetting(params, type, settingFor) {
  return request({
    url: "autz-setting/" + type + "/" + settingFor,
    method: 'get',
    params:params
  })
}

export function updateAutzSetting(params) {
  return request({
    url: '/autz-setting',
    method: 'PATCH',
    data:params
  })
}
