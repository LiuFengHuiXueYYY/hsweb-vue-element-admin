import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    url: '/authorize/login',
    method: 'post',
    data: {
      password: password,
      username: username,
      token_type: "token"
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/authorize/me?token=' + token,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/authorize/login-out',
    method: 'get'
  })
}
