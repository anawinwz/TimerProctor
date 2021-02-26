import { fetchAPI } from './api'

const localStorage = window.localStorage

class TokenManager {
  constructor(key = '') {
    this.key = `${key ? `${key}_` : ''}accessToken`
    this.refreshKey = `${key ? `${key}_` : ''}refreshToken`
  }

  get accessToken() { return localStorage.getItem(this.key) || '' }
  set accessToken(token) { localStorage.setItem(this.key, token) }
  removeAccessToken() { return localStorage.removeItem(this.key) }

  get refreshToken() { return localStorage.getItem(this.refreshKey) || '' }
  set refreshToken(token) { localStorage.setItem(this.refreshKey, token) }
  removeRefreshToken() { return localStorage.removeItem(this.refreshKey) }
  
  async renewToken() {
    try {
      const res = await fetchAPI('/users/renew', { refreshToken: getRefreshToken() })
      const { status, message, payload } = res
      if (status === 'ok') {
        const { accessToken, refreshToken } = payload
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return Promise.resolve(true)
      } else {
        return Promise.reject(new Error(message || 'เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ'))
      }
    } catch {
      return Promise.reject(new Error('เกิดข้อผิดพลาดในการต่ออายุการเข้าสู่ระบบ'))
    }
  }
}

export const userToken = new TokenManager()
export const adminToken = new TokenManager('admin')
