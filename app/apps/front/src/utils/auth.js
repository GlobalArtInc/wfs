var cookie = require('vue-cookie')

const TokenKey = 'token'
const RefreshKey = 'refresh_token'

export function getToken() {
  return cookie.get(TokenKey)
}

export function getRefreshToken() {
  return cookie.get(RefreshKey)
}

export function setToken(token) {
  return cookie.set(TokenKey, token)
}

export function setRefreshToken(token) {
  return cookie.set(RefreshKey, token)
}

export function removeToken() {
  return cookie.delete(TokenKey)
}
