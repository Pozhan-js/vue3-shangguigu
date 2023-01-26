const TokenKey = 'atguigu_admin_token'


// 获取本地存储token
export function getToken() {
  return localStorage.getItem(TokenKey)
}

// 修改本地存储token
export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token)
}


// 删除指定token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
