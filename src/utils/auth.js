import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIdKey = 'Admin-UserId'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
